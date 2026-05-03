let canvas = null;
let ctx = null;
let isDrawing = false;
let color = '#5ef1ff';
let lastPoint = null;

function initPaint() {
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
  canvas.style.touchAction = 'none';

  canvas.addEventListener('pointerdown', startDraw);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDraw);
  canvas.addEventListener('pointerleave', stopDraw);
}

function getPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDraw(e) {
  isDrawing = true;
  lastPoint = getPoint(e);
  drawDot(lastPoint);
}

function draw(e) {
  if (!isDrawing || !ctx) return;
  const point = getPoint(e);
  drawLine(lastPoint, point);
  lastPoint = point;
}

function stopDraw() {
  isDrawing = false;
  lastPoint = null;
}

function drawDot(p) {
  if (!ctx || !p) return;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(from, to) {
  if (!ctx || !from || !to) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function setPaintColor(c) {
  color = c;
}

function clearPaint() {
  if (!ctx || !canvas) return;
  ctx.fillStyle = 'rgba(4, 8, 22, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', initPaint);
window.addEventListener('resize', () => canvas && initPaint());
