const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let drawing = false;
let currentColor = 'black';
const brushSize = 5; 
let lastX = 0;
let lastY = 0;

// Set color when clicked
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentColor = btn.dataset.color;
  });
});

// Erase all
document.getElementById('erase-btn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Start drawing
function startDrawing(x, y) {
  drawing = true;
  lastX = x;
  lastY = y;
}

function stopDrawing() {
  drawing = false;
}

function drawLine(x, y) {
  if (!drawing) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize * 2; 
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

// Mouse events
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  startDrawing(e.clientX - rect.left, e.clientY - rect.top);
});
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  drawLine(e.clientX - rect.left, e.clientY - rect.top);
});

// Touch events
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchend', e => {
  e.preventDefault();
  stopDrawing();
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
});