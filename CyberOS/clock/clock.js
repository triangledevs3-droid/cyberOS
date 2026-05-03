function updateClock() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const timeOfDay = now.getHours() >= 6 && now.getHours() < 18 ? 'Day mode' : 'Night mode';

  const els = {
    time: document.getElementById('clock-time'),
    date: document.getElementById('clock-date'),
    theme: document.getElementById('clock-theme')
  };

  if (els.time) els.time.textContent = time;
  if (els.date) els.date.textContent = date;
  if (els.theme) els.theme.textContent = timeOfDay;
}