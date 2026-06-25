// Get elements
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const predictBtn = document.getElementById('predictBtn');
const resultsContainer = document.getElementById('resultsContainer');
const chart = document.getElementById('chart');

// Canvas settings
const lineWidth = 8;
const lineColor = '#ecf0f1';
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Resize canvas untuk device responsif
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(container.offsetWidth, 600);
    canvas.width = maxWidth;
    canvas.height = maxWidth; // Square canvas
    
    // Redraw if ada yang sudah digambar
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize canvas
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
        lastX = (e.touches[0].clientX - rect.left) * scaleX;
        lastY = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        lastX = (e.clientX - rect.left) * scaleX;
        lastY = (e.clientY - rect.top) * scaleY;
    }
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let currentX, currentY;
    if (e.touches) {
        currentX = (e.touches[0].clientX - rect.left) * scaleX;
        currentY = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        currentX = (e.clientX - rect.left) * scaleX;
        currentY = (e.clientY - rect.top) * scaleY;
    }
    
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = lineColor;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Event listeners untuk mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Event listeners untuk touch
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
});

// Clear button
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    resultsContainer.classList.remove('show');
    
    // Glow effect
    clearBtn.style.boxShadow = '0 0 30px #e74c3c, 0 0 60px rgba(231, 76, 60, 0.8)';
    setTimeout(() => {
        clearBtn.style.boxShadow = '';
    }, 300);
});

// Predict button
predictBtn.addEventListener('click', async () => {
    // Glow effect
    predictBtn.style.boxShadow = '0 0 30px #00b4d8, 0 0 60px rgba(0, 180, 216, 0.8)';
    predictBtn.disabled = true;
    predictBtn.textContent = '⏳ Loading...';
    
    // Get image dari canvas
    const imageData = canvas.toDataURL('image/png');
    
    try {
        // Send ke backend
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error predicting: ' + error);
    }
    
    // Reset button
    predictBtn.disabled = false;
    predictBtn.innerHTML = '<span class="btn-icon">🧠</span>PREDICT';
    
    setTimeout(() => {
        predictBtn.style.boxShadow = '';
    }, 300);
});

// Display results dengan animated chart
function displayResults(data) {
    const digit = data.digit;
    const probabilities = data.probabilities;
    
    // Clear previous chart
    chart.innerHTML = '';
    
    // Create bars
    probabilities.forEach((prob, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.style.animationDelay = `${index * 50}ms`;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        // Set height based on probability
        const barHeight = prob * 100; // Percentage
        
        // Animate bar height
        setTimeout(() => {
            bar.style.height = `${barHeight}%`;
        }, 100);
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = index;
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = (prob * 100).toFixed(1) + '%';
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(value);
        chart.appendChild(barContainer);
    });
    
    // Show results container
    resultsContainer.classList.add('show');
    
    // Update predicted digit
    const predictedDigitDiv = document.getElementById('predictedDigit');
    predictedDigitDiv.textContent = digit;
    
    // Scroll ke results (smooth)
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

console.log('✅ Handwriting Neural Network loaded!');
