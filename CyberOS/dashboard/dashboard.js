let currentBackground = 'default';
const backgroundPresets = ['default', 'blue', 'sunset', 'space'];
const OSDisplayNames = { windows11: 'Windows 11', macos: 'MacOS', linux: 'Linux' };

function showDashboardStats() {
  const openCount = [...document.querySelectorAll('.app-interface')].filter(a => a.style.display === 'block').length;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  
  const updates = {
    'dashboard-app-count': String(openCount),
    'dashboard-theme': currentTheme === 'dark' ? 'Dark' : 'Light',
    'dashboard-os-mode': OSDisplayNames[currentOSMode],
    'dashboard-bg-mode': currentBackground.charAt(0).toUpperCase() + currentBackground.slice(1),
    'dashboard-time': `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  };
  
  Object.entries(updates).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const isDark = currentTheme === 'dark';
  
  ['body', '#taskbar', '#boot-screen'].forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.classList.toggle('light-theme', !isDark);
  });
  
  showDashboardStats();
}

function setOSBackground(background) {
  if (!backgroundPresets.includes(background)) {
    background = 'default';
  }

  currentBackground = background;
  applyBackground();
  showDashboardStats();
}

function applyBackground() {
  const body = document.body;
  if (!body) return;

  body.classList.remove(...backgroundPresets.map((preset) => `bg-${preset}`));
  body.classList.add(`bg-${currentBackground}`);
}

function applyOSMode() {
  const body = document.body;
  if (!body) return;

  body.classList.remove('windows11', 'macos', 'linux');
  body.classList.add(currentOSMode);
  body.classList.toggle('light-theme', currentTheme === 'light');
  body.classList.toggle('dark-theme', currentTheme === 'dark');
  showDashboardStats();
  refreshTaskbarButtons();
}

function setOSMode(mode) {
  const body = document.body;
  if (!body) return;

  currentOSMode = osModes.includes(mode) ? mode : 'windows11';
  applyOSMode();
}
