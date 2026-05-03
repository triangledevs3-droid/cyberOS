// Enhanced Music Player
const musicPlaylist = [
  { id: 0, name: 'Cyber Waves', duration: '3:24', artist: 'Digital Symphony' },
  { id: 1, name: 'Neon Skyline', duration: '4:12', artist: 'Synth Masters' },
  { id: 2, name: 'Pixel Pulse', duration: '3:45', artist: ' Electronic Dreams' },
  { id: 3, name: 'Circuit Dreams', duration: '3:58', artist: 'Digital Horizon' },
  { id: 4, name: 'Glitch Groove', duration: '4:03', artist: 'Cyber Beats' }
];

let musicCurrentTrack = 0;
let musicIsPlaying = false;
let musicVolume = 0.08;
let musicLoop = false;
let musicShuffle = false;
let audioContext = null;
let oscillator = null;

function initMusicPlayer() {
  const track = document.getElementById('music-track');
  const status = document.getElementById('music-status');
  
  if (track && musicPlaylist[musicCurrentTrack]) {
    track.textContent = `▶ ${musicPlaylist[musicCurrentTrack].name}`;
  }
  if (status) status.textContent = 'Music Player Ready';
}

function playMusicTrack() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      alert('Audio API not supported.');
      return;
    }
    audioContext = new AudioCtx();
  }

  const track = musicPlaylist[musicCurrentTrack];
  const status = document.getElementById('music-status');

  musicIsPlaying = true;
  
  // Create oscillator for music simulation
  oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 220 + musicCurrentTrack * 50;
  gain.gain.value = musicVolume;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();

  if (status) status.textContent = `Now Playing: ${track.name} by ${track.artist}`;

  // Simulate track duration and auto-advance
  const duration = parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]);
  setTimeout(() => {
    stopMusicTrack();
    musicCurrentTrack = musicShuffle ? Math.floor(Math.random() * musicPlaylist.length) : (musicCurrentTrack + 1) % musicPlaylist.length;
    updateMusicDisplay();
  }, duration * 1000);
}

function pauseMusicTrack() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
  musicIsPlaying = false;
  const status = document.getElementById('music-status');
  if (status) status.textContent = 'Paused';
}

function stopMusicTrack() {
  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {}
    oscillator = null;
  }
  musicIsPlaying = false;
  const status = document.getElementById('music-status');
  if (status) status.textContent = 'Stopped';
}

function nextMusicTrack() {
  stopMusicTrack();
  musicCurrentTrack = (musicCurrentTrack + 1) % musicPlaylist.length;
  updateMusicDisplay();
}

function prevMusicTrack() {
  stopMusicTrack();
  musicCurrentTrack = (musicCurrentTrack - 1 + musicPlaylist.length) % musicPlaylist.length;
  updateMusicDisplay();
}

function toggleMusicShuffle() {
  musicShuffle = !musicShuffle;
  const shuffleBtn = document.getElementById('music-shuffle-btn');
  if (shuffleBtn) {
    shuffleBtn.style.opacity = musicShuffle ? '1' : '0.5';
    shuffleBtn.textContent = '🔀 Shuffle: ' + (musicShuffle ? 'ON' : 'OFF');
  }
}

function toggleMusicLoop() {
  musicLoop = !musicLoop;
  const loopBtn = document.getElementById('music-loop-btn');
  if (loopBtn) {
    loopBtn.style.opacity = musicLoop ? '1' : '0.5';
    loopBtn.textContent = '🔁 Loop: ' + (musicLoop ? 'ON' : 'OFF');
  }
}

function updateMusicVolume(vol) {
  musicVolume = vol / 100;
  if (oscillator) {
    // Note: In a real implementation, we'd have access to the gain node
    console.log('Volume set to:', musicVolume);
  }
}

function updateMusicDisplay() {
  const track = document.getElementById('music-track');
  const artist = document.getElementById('music-artist');
  const duration = document.getElementById('music-duration');

  if (track && musicPlaylist[musicCurrentTrack]) {
    track.textContent = `${musicIsPlaying ? '▶' : '⏸'} ${musicPlaylist[musicCurrentTrack].name}`;
  }
  if (artist && musicPlaylist[musicCurrentTrack]) {
    artist.textContent = `Artist: ${musicPlaylist[musicCurrentTrack].artist}`;
  }
  if (duration && musicPlaylist[musicCurrentTrack]) {
    duration.textContent = `Duration: ${musicPlaylist[musicCurrentTrack].duration}`;
  }
}

function showMusicPlaylist() {
  let html = '<div style="background:#0a1a33;padding:16px;border-radius:8px;max-height:300px;overflow-y:auto;">';
  html += '<h3 style="margin-top:0;">Playlist</h3>';
  
  musicPlaylist.forEach((track, index) => {
    const isActive = index === musicCurrentTrack ? 'background:#1a3a52;' : '';
    html += `<div style="padding:8px;cursor:pointer;border-radius:4px;${isActive};margin:4px 0;" 
             onclick="musicCurrentTrack=${index};updateMusicDisplay();">
      ${index + 1}. ${track.name} (${track.duration})
    </div>`;
  });
  
  html += '</div>';
  document.getElementById('music-status').innerHTML = html;
}

// Legacy functions for compatibility
const tracks = musicPlaylist.map(t => t.name);
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

document.addEventListener('DOMContentLoaded', initMusicPlayer);
