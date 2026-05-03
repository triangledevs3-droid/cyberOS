// Enhanced Weather System
const weatherData = {
  cities: {
    'New York': { temp: 72, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: '⛅' },
    'Los Angeles': { temp: 85, condition: 'Sunny', humidity: 45, wind: 8, icon: '☀️' },
    'Chicago': { temp: 68, condition: 'Rainy', humidity: 80, wind: 18, icon: '🌧️' },
    'Houston': { temp: 88, condition: 'Hot & Sunny', humidity: 70, wind: 10, icon: '🌡️' },
    'Phoenix': { temp: 95, condition: 'Very Hot', humidity: 20, wind: 5, icon: '🔥' },
    'Philadelphia': { temp: 70, condition: 'Cloudy', humidity: 60, wind: 14, icon: '☁️' },
    'San Antonio': { temp: 86, condition: 'Sunny', humidity: 50, wind: 11, icon: '☀️' },
    'San Diego': { temp: 75, condition: 'Beautiful', humidity: 55, wind: 9, icon: '🌅' },
    'Dallas': { temp: 82, condition: 'Partly Cloudy', humidity: 62, wind: 13, icon: '⛅' },
    'San Jose': { temp: 74, condition: 'Pleasant', humidity: 58, wind: 10, icon: '☀️' },
    'London': { temp: 59, condition: 'Rainy', humidity: 75, wind: 16, icon: '🌧️' },
    'Paris': { temp: 64, condition: 'Cloudy', humidity: 68, wind: 12, icon: '☁️' },
    'Tokyo': { temp: 77, condition: 'Humid', humidity: 85, wind: 8, icon: '💧' },
    'Sydney': { temp: 68, condition: 'Clear', humidity: 52, wind: 10, icon: '🌟' }
  },
  currentCity: 'New York'
};

function updateWeather() {
  const cityDisplay = document.getElementById('weather-city');
  const tempDisplay = document.getElementById('weather-temp');
  const conditionDisplay = document.getElementById('weather-condition');
  const iconDisplay = document.getElementById('weather-icon');
  const detailsDisplay = document.getElementById('weather-details');

  if (!cityDisplay || !tempDisplay) return;

  const currentWeather = weatherData.cities[weatherData.currentCity];
  if (!currentWeather) return;

  if (cityDisplay) cityDisplay.textContent = weatherData.currentCity;
  if (tempDisplay) tempDisplay.textContent = `${currentWeather.temp}°F`;
  if (conditionDisplay) conditionDisplay.textContent = currentWeather.condition;
  if (iconDisplay) iconDisplay.textContent = currentWeather.icon;
  if (detailsDisplay) {
    detailsDisplay.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><strong>Humidity:</strong> ${currentWeather.humidity}%</div>
        <div><strong>Wind:</strong> ${currentWeather.wind} mph</div>
      </div>
    `;
  }
}

function changeWeatherCity(city) {
  if (weatherData.cities[city]) {
    weatherData.currentCity = city;
    updateWeather();
  }
}

function getWeatherForecast() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const temps = [68, 72, 75, 70, 65, 64, 68];
  const icons = ['⛅', '☀️', '☀️', '🌧️', '☁️', '🌧️', '⛅'];

  let forecast = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">';
  days.forEach((day, i) => {
    forecast += `<div style="text-align:center;padding:8px;background:#0a1a33;border-radius:6px;">
      <div>${day}</div>
      <div style="font-size:24px;margin:8px 0;">${icons[i]}</div>
      <div>${temps[i]}°</div>
    </div>`;
  });
  forecast += '</div>';

  return forecast;
}

function showWeatherForecast() {
  const weatherWindow = document.getElementById('weather');
  if (!weatherWindow) return;

  const forecastDiv = document.createElement('div');
  forecastDiv.id = 'weather-forecast';
  forecastDiv.style.marginTop = '16px';
  forecastDiv.innerHTML = getWeatherForecast();

  const existing = document.getElementById('weather-forecast');
  if (existing) existing.remove();

  weatherWindow.appendChild(forecastDiv);
}

// Initialize weather on load
document.addEventListener('DOMContentLoaded', updateWeather);
