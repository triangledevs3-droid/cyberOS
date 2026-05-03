const tracks = ['Cyber Waves', 'Neon Skyline', 'Pixel Pulse', 'Circuit Dreams', 'Glitch Groove'];
let trackIndex = 0;

function updateMusicDisplay() {
  const track = document.getElementById('music-track');
  const status = document.getElementById('music-status');
  if (track) track.textContent = `Now playing: ${tracks[trackIndex]}`;
  if (status) status.textContent = 'Ready to play a synth tone.';
}

function nextTrack() {
  trackIndex = (trackIndex + 1) % tracks.length;
  updateMusicDisplay();
}

function playTrack() {
  const status = document.getElementById('music-status');
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  
  if (!AudioCtx) {
    if (status) status.textContent = 'Audio API not supported.';
    return;
  }

  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.value = 220 + trackIndex * 40;
  gain.gain.value = 0.08;

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  
  if (status) status.textContent = `Playing ${tracks[trackIndex]}...`;

  setTimeout(() => {
    osc.stop();
    ctx.close();
    if (status) status.textContent = 'Synth tone finished. Choose another track.';
  }, 650);
}

document.addEventListener('DOMContentLoaded', updateMusicDisplay);
