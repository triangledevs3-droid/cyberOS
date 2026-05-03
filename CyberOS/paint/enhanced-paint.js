// Enhanced Paint Application
let canvas = null;
let ctx = null;
let isDrawing = false;
let currentColor = '#5ef1ff';
let brushSize = 8;
let currentTool = 'pen';
let lastPoint = null;
let startPoint = null;
let undoStack = [];
let redoStack = [];

function initPaintEnhanced() {
  canvas = document.getElementById('paint-canvas');
  if (!canvas) return;

  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  clearPaint();
  
  // Save initial state
  saveCanvasState();
  
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDraw);
  canvas.addEventListener('pointerleave', stopDraw);
}

function saveCanvasState() {
  if (!canvas || !ctx) return;
  undoStack.push(canvas.toDataURL());
  redoStack = [];
}

function undoPaint() {
  if (undoStack.length <= 1) return;
  
  redoStack.push(undoStack.pop());
  const previousState = undoStack[undoStack.length - 1];
  
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = previousState;
}

function redoPaint() {
  if (redoStack.length === 0) return;
  
  const nextState = redoStack.pop();
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    undoStack.push(nextState);
  };
  img.src = nextState;
}

function getPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDraw(e) {
  if (currentTool === 'text') {
    const point = getPoint(e);
    const text = prompt('Enter text:');
    if (text) {
      ctx.fillStyle = currentColor;
      ctx.font = `${brushSize * 2}px Arial`;
      ctx.fillText(text, point.x, point.y);
      saveCanvasState();
    }
    return;
  }
  
  if (currentTool === 'eyedropper') {
    const point = getPoint(e);
    const imageData = ctx.getImageData(point.x, point.y, 1, 1);
    const data = imageData.data;
    currentColor = '#' + [data[0], data[1], data[2]].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
    return;
  }

  isDrawing = true;
  lastPoint = getPoint(e);
  startPoint = lastPoint;
  
  if (currentTool === 'pen' || currentTool === 'eraser') {
    drawDot(lastPoint);
  }
}

function draw(e) {
  if (!isDrawing || !ctx) return;
  
  const point = getPoint(e);
  
  switch (currentTool) {
    case 'pen':
      drawLine(lastPoint, point);
      break;
    case 'eraser':
      eraseArea(point);
      break;
    case 'rect':
      previewRect(startPoint, point);
      break;
    case 'circle':
      previewCircle(startPoint, point);
      break;
    case 'line':
      previewLine(startPoint, point);
      break;
  }
  
  lastPoint = point;
}

function stopDraw() {
  if (!isDrawing) return;
  
  isDrawing = false;
  
  if (['rect', 'circle', 'line'].includes(currentTool)) {
    saveCanvasState();
  } else if (currentTool === 'pen' || currentTool === 'eraser') {
    saveCanvasState();
  }
  
  lastPoint = null;
  startPoint = null;
}

function drawDot(p) {
  if (!ctx || !p) return;
  ctx.fillStyle = currentColor;
  ctx.beginPath();
  ctx.arc(p.x, p.y, brushSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(from, to) {
  if (!ctx || !from || !to) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function eraseArea(point) {
  if (!ctx || !point) return;
  ctx.clearRect(point.x - brushSize / 2, point.y - brushSize / 2, brushSize, brushSize);
}

function drawRect(from, to) {
  if (!ctx || !from || !to) return;
  const width = to.x - from.x;
  const height = to.y - from.y;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(from.x, from.y, width, height);
}

function previewRect(from, to) {
  if (!undoStack.length) return;
  
  // Restore from undo and redraw
  const previousState = undoStack[undoStack.length - 1];
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    drawRect(from, to);
  };
  img.src = previousState;
}

function drawCircle(from, to) {
  if (!ctx || !from || !to) return;
  const radius = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(from.x, from.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function previewCircle(from, to) {
  if (!undoStack.length) return;
  
  const previousState = undoStack[undoStack.length - 1];
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    drawCircle(from, to);
  };
  img.src = previousState;
}

function drawLineShape(from, to) {
  if (!ctx || !from || !to) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function previewLine(from, to) {
  if (!undoStack.length) return;
  
  const previousState = undoStack[undoStack.length - 1];
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    drawLineShape(from, to);
  };
  img.src = previousState;
}

function fillBucket(point) {
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const targetColor = ctx.getImageData(point.x, point.y, 1, 1).data;
  const newColor = [
    parseInt(currentColor.slice(1, 3), 16),
    parseInt(currentColor.slice(3, 5), 16),
    parseInt(currentColor.slice(5, 7), 16),
    255
  ];
  
  floodFill(data, canvas.width, canvas.height, Math.floor(point.x), Math.floor(point.y), targetColor, newColor);
  
  ctx.putImageData(imageData, 0, 0);
  saveCanvasState();
}

function floodFill(data, width, height, x, y, targetColor, newColor) {
  const queue = [[x, y]];
  const visited = new Set();
  
  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    const key = `${cx},${cy}`;
    
    if (visited.has(key) || cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
    visited.add(key);
    
    const idx = (cy * width + cx) * 4;
    
    if (data[idx] === targetColor[0] && data[idx + 1] === targetColor[1] && 
        data[idx + 2] === targetColor[2]) {
      data[idx] = newColor[0];
      data[idx + 1] = newColor[1];
      data[idx + 2] = newColor[2];
      data[idx + 3] = newColor[3];
      
      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }
}

function setPaintColor(c) {
  currentColor = c;
}

function setPaintTool(tool) {
  currentTool = tool;
}

function setBrushSize(size) {
  brushSize = size;
}

function clearPaint() {
  if (!ctx || !canvas) return;
  ctx.fillStyle = 'rgba(4, 8, 22, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function downloadPaint() {
  if (!canvas) return;
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `artwork_${Date.now()}.png`;
  link.click();
}

function newPaint() {
  clearPaint();
  undoStack = [];
  redoStack = [];
  saveCanvasState();
}

document.addEventListener('DOMContentLoaded', initPaintEnhanced);
window.addEventListener('resize', () => canvas && initPaintEnhanced());
