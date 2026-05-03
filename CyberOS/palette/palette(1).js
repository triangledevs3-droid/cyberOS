const palettes = [
  ['#F3A4FF', '#69D6FF', '#6CFF94', '#F1E87F'],
  ['#FF8271', '#FFCE6A', '#6CDBE8', '#7A5CFF'],
  ['#7EFFB2', '#3EAFE4', '#D297FF', '#FF74A9'],
  ['#FFEA64', '#4A84FF', '#4FF3C6', '#C36EFF']
];

function refreshPalette() {
  const hexEl = document.getElementById('palette-hex');
  const swatchesEl = document.getElementById('palette-swatches');
  if (!hexEl || !swatchesEl) return;

  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  hexEl.textContent = palette.join(', ');
  swatchesEl.innerHTML = palette.map(color => 
    `<div class="palette-chip" style="background:${color};color:#04122f;">${color}</div>`
  ).join('');
}

function copyPalette() {
  const el = document.getElementById('palette-hex');
  if (el) copyToClipboard(el.textContent.trim());
}
