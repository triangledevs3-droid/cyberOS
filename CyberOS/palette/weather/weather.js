const forecasts = [
  'Warm and bright with a gentle breeze.',
  'Cloudy afternoon with light rain.',
  'Clear night skies and calm air.',
  'Fresh morning mist followed by sunny intervals.',
  'Breezy with scattered showers later.'
];

function updateWeather() {
  const el = document.getElementById('weather-text');
  if (el) el.textContent = `Forecast: ${forecasts[Math.floor(Math.random() * forecasts.length)]}`;
}

function copyWeather() {
  const el = document.getElementById('weather-text');
  if (el) copyToClipboard(el.textContent.trim());
}
