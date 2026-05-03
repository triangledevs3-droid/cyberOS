const tips = [
  'Save energy by unplugging devices when not in use.',
  'Reduce plastic waste by choosing reusable bags and bottles.',
  'Use natural light when possible to lower electricity use.',
  'Plant a small garden or houseplant to improve air quality.',
  'Recycle paper, glass, and plastics to keep landfills smaller.'
];

function showEcoTip() {
  const el = document.getElementById('eco-tip-text');
  if (el) el.textContent = tips[ecoTipIndex++ % tips.length];
}

function copyEcoTip() {
  const el = document.getElementById('eco-tip-text');
  if (el) copyToClipboard(el.textContent.trim());
}
