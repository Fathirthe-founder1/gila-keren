# 📖 Setup Guide - Handwriting Neural Network

Panduan lengkap setup dan cara menjalankan Handwriting Neural Network.

## 🎯 Quick Start (3 Menit)

```bash
# 1. Clone repo
git clone https://github.com/Fathirthe-founder1/handwriting-neural-network.git
cd handwriting-neural-network

# 2. Setup virtual environment & install
python -m venv venv
source venv/bin/activate  # macOS/Linux
# atau
venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run!
python app.py

# 5. Open browser
# http://localhost:5000
```

## 📋 Prerequisite & Requirements

### System Requirements
- **Python**: 3.8+ (check: `python --version`)
- **Disk Space**: ~1GB (untuk TensorFlow + model)
- **RAM**: 4GB minimum (recommended 8GB)
- **OS**: Windows, macOS, Linux

### Python Packages
Semua akan terinstall otomatis dengan:
```bash
pip install -r requirements.txt
```

Packages yang diinstall:
- `Flask==2.3.3` - Web framework
- `tensorflow==2.13.0` - Deep learning
- `numpy==1.24.3` - Numerical computing
- `keras==2.13.0` - Neural network API
- `Werkzeug==2.3.7` - WSGI utilities

## 🔧 Setup Lengkap Step-by-Step

### Step 1: Install Python
- Download dari https://www.python.org/downloads/
- **PENTING**: Check opsi "Add Python to PATH" saat install
- Verify: `python --version`

### Step 2: Clone Repository
```bash
git clone https://github.com/Fathirthe-founder1/handwriting-neural-network.git
cd handwriting-neural-network
```

### Step 3: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Setelah activate, terminal akan show `(venv)` prefix.

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

**Note:** Proses ini bisa memakan 5-10 menit tergantung kecepatan internet (TensorFlow ~500MB).

### Step 5: Run Application
```bash
python app.py
```

Output akan terlihat seperti:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Step 6: Open Browser
```
http://localhost:5000
```

## 🚀 First Run (Training Model)

**Pertama kali jalankan:**
- Model akan download MNIST dataset (~100MB)
- Training akan berjalan (~2-3 menit)
- File `mnist_model.h5` akan tersave (~1.2MB)

**Konsol akan show:**
```
Training new MNIST model...
Epoch 1/10
1875/1875 [==============================] - 12s 6ms/step - loss: 0.2821 - accuracy: 0.9179
...
Epoch 10/10
1875/1875 [==============================] - 12s 6ms/step - loss: 0.0545 - accuracy: 0.9830
Model saved to mnist_model.h5
```

**Run berikutnya lebih cepat** (langsung load model)

## 📱 Akses dari Mobile

### Lokal Network (Rumah/Kantor)
1. **Cari IP lokal komputer:**
   
   **Windows:**
   ```bash
   ipconfig
   ```
   Cari baris "IPv4 Address" (contoh: 192.168.1.100)
   
   **macOS/Linux:**
   ```bash
   ifconfig
   ```
   Cari baris "inet" (contoh: 192.168.1.100)

2. **Akses dari mobile:**
   ```
   http://192.168.1.100:5000
   ```
   (Pastikan mobile & komputer di network yang sama)

### Akses Global (Internet)
Lihat bagian **Deploy** untuk akses dari internet

## 🆘 Common Errors & Solutions

### Error 1: "ModuleNotFoundError: No module named 'tensorflow'"
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

### Error 2: "Port 5000 is already in use"
```python
# Edit app.py, baris terakhir:
app.run(debug=True, port=5001)  # Gunakan port berbeda
```

Atau kill process yang menggunakan port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Error 3: "Python not found" atau "python is not recognized"
- Python tidak di-install atau tidak di PATH
- Reinstall Python dan centang "Add Python to PATH"
- Atau gunakan `python3` instead of `python`

### Error 4: Canvas tidak bisa digambar
- Refresh browser (Ctrl+R atau Cmd+R)
- Buka DevTools (F12) dan check console errors
- Gunakan browser terbaru (Chrome, Firefox, Safari, Edge)

### Error 5: Prediction error setelah upload gambar
- Model mungkin masih training
- Tunggu sampai `mnist_model.h5` file ada (~5MB)
- Restart aplikasi

### Error 6: TensorFlow sangat lambat install
- TensorFlow large (~500MB)
- Gunakan WiFi stabil
- Jangan interrupt proses install
- Bisa install dengan GPU support untuk lebih cepat

## 📊 Verify Installation

Pastikan semuanya installed dengan benar:

```bash
# 1. Check Python version
python --version
# Expected: Python 3.8+

# 2. Check virtual environment
# Terminal harus show (venv) prefix

# 3. Check packages
pip list
# Expected: Flask, tensorflow, numpy, keras ada di list

# 4. Test TensorFlow
python -c "import tensorflow as tf; print(tf.__version__)"
# Expected: 2.13.0 (atau versi similar)
```

## 🔄 Deactivate & Cleanup

### Deactivate virtual environment
```bash
deactivate
```

### Delete virtual environment
```bash
# Windows
rmdir /s venv

# macOS/Linux
rm -rf venv
```

### Delete model file
```bash
# Clean file
rm mnist_model.h5
```

## 🌐 Deploy ke Production

### Railway (Recommended)
1. Push code ke GitHub
2. Signup di https://railway.app
3. Connect GitHub repo
4. Auto-deploy!
5. URL: `https://[your-app].railway.app`

### Heroku
```bash
heroku login
heroku create [app-name]
git push heroku main
```

### PythonAnywhere
1. Upload ke PythonAnywhere
2. Setup web app
3. Configure Python + virtual env
4. URL: `https://[username].pythonanywhere.com`

## 💡 Tips & Tricks

### Run dengan specific port
```bash
# Change port in app.py or command line
python app.py --port=8000
```

### Debug mode
```python
# app.py
app.run(debug=True, port=5000)  # Already set
```

### Hot reload
Flask automatically reload saat file berubah (debug mode ON)

### Performance
- Gambar lebih jelas untuk prediction akurat
- Sudut 45 derajat lebih mudah dikenali
- Slower internet = tunggu model training

## 📚 File Explanation

```
handwriting-neural-network/
├── app.py                     # Main Flask + TensorFlow
│   ├── Load/train MNIST model
│   ├── Preprocess canvas image
│   └── Return predictions
│
├── requirements.txt           # Dependencies list
│
├── templates/index.html      # HTML template
│   ├── Canvas untuk drawing
│   ├── Buttons (Predict, Clear)
│   ├── Results container
│   └── Loading spinner
│
├── static/
│   ├── style.css             # Dark theme styling
│   │   ├── Color variables
│   │   ├── Canvas styling
│   │   ├── Button neon glow
│   │   ├── Chart styling
│   │   └── Animations
│   │
│   └── script.js             # Canvas & API
│       ├── Draw on canvas
│       ├── Send data to backend
│       ├── Display results
│       └── Chart animation
│
├── mnist_model.h5            # Trained model (auto-generated)
└── README.md & setup.md      # Documentation
```

## ✅ Verification Checklist

Sebelum mulai development atau deploy:

- [ ] Python 3.8+ terinstall
- [ ] Repository di-clone
- [ ] Virtual environment created
- [ ] Virtual environment activated (show `(venv)`)
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `app.py` bisa dijalankan tanpa error
- [ ] Port 5000 available
- [ ] Browser bisa akses `localhost:5000`
- [ ] Canvas bisa digambar (click & drag)
- [ ] Predict button berfungsi
- [ ] Results chart muncul
- [ ] Mobile dapat akses dari local IP
- [ ] `mnist_model.h5` file exists

## 🎓 Next Steps

Setelah setup berhasil:

1. **Explore Code**: Baca `app.py` dan pahami model
2. **Modify Model**: Edit architecture di `app.py`
3. **Customize Design**: Ubah warna di `static/style.css`
4. **Deploy**: Push ke GitHub dan deploy ke Railway
5. **Share**: Share URL dengan teman!

## 📞 Need Help?

- Baca error message dengan careful
- Google error message
- Check GitHub issues
- Buat issue baru dengan detail error

---

Happy coding! 🚀

Created with ❤️ by Fathir | 2026
