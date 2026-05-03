let stream = null;

function startCamera() {
  const status = document.getElementById('camera-status');
  const video = document.getElementById('camera-preview');
  if (!video) return;

  if (!navigator.mediaDevices?.getUserMedia) {
    if (status) status.textContent = 'Camera not supported.';
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(s => {
      stream = s;
      video.srcObject = s;
      video.play().catch(() => {});
      if (status) status.textContent = 'Camera active. Click Capture to take a photo.';
    })
    .catch(() => {
      if (status) status.textContent = 'Camera access denied.';
    });
}

function stopCamera() {
  if (!stream) return;
  stream.getTracks().forEach(t => t.stop());
  stream = null;
  const video = document.getElementById('camera-preview');
  if (video) video.srcObject = null;
}

function takePhoto() {
  const video = document.getElementById('camera-preview');
  const photo = document.getElementById('camera-photo');
  if (!video || !photo) return;

  const c = document.createElement('canvas');
  c.width = video.videoWidth || 640;
  c.height = video.videoHeight || 480;
  const ctx = c.getContext('2d');
  if (ctx) ctx.drawImage(video, 0, 0);
  photo.src = c.toDataURL('image/png');
}
