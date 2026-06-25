from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from tensorflow import keras
import numpy as np
import base64
import io
from PIL import Image
import os

app = Flask(__name__)

# Load atau buat model MNIST
MODEL_PATH = 'mnist_model.h5'

def load_or_create_model():
    """Load model yang sudah terlatih atau buat model baru"""
    if os.path.exists(MODEL_PATH):
        print("✅ Model ditemukan, loading...")
        model = keras.models.load_model(MODEL_PATH)
    else:
        print("🔄 Model tidak ditemukan, membuat model baru...")
        # Load MNIST dataset
        (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
        
        # Normalize data (0-1)
        x_train = x_train.astype("float32") / 255
        x_test = x_test.astype("float32") / 255
        
        # Flatten images
        x_train = x_train.reshape(-1, 28 * 28)
        x_test = x_test.reshape(-1, 28 * 28)
        
        # Build model
        model = keras.Sequential([
            keras.layers.Dense(256, activation="relu", input_shape=(784,)),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(128, activation="relu"),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(64, activation="relu"),
            keras.layers.Dense(11, activation="softmax")  # 11 kelas (0-10)
        ])
        
        # Compile
        model.compile(
            loss="sparse_categorical_crossentropy",
            optimizer="adam",
            metrics=["accuracy"]
        )
        
        # Training
        print("⏳ Training model... (ini memakan waktu 2-3 menit)")
        model.fit(
            x_train, y_train,
            batch_size=128,
            epochs=10,
            validation_split=0.1,
            verbose=1
        )
        
        # Evaluate
        test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
        print(f"✅ Test accuracy: {test_acc:.4f}")
        
        # Save model
        model.save(MODEL_PATH)
        print(f"💾 Model disimpan ke {MODEL_PATH}")
    
    return model

# Load model saat startup
model = load_or_create_model()

@app.route('/')
def index():
    """Render homepage"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint untuk prediksi"""
    try:
        # Get image data dari request
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data'}), 400
        
        # Decode base64 image
        image_data = image_data.split(',')[1]  # Remove data:image/png;base64,
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert ke grayscale
        image = image.convert('L')
        
        # Resize ke 28x28
        image = image.resize((28, 28), Image.Resampling.LANCZOS)
        
        # Convert ke numpy array dan normalize
        image_array = np.array(image).astype('float32') / 255.0
        
        # Flatten
        image_array = image_array.reshape(1, -1)
        
        # Predict
        predictions = model.predict(image_array, verbose=0)
        probabilities = predictions[0].tolist()
        predicted_digit = int(np.argmax(predictions))
        confidence = float(probabilities[predicted_digit])
        
        return jsonify({
            'success': True,
            'digit': predicted_digit,
            'confidence': confidence,
            'probabilities': probabilities
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # For production (Railway)
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
