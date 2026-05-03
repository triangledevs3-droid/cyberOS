let activeWindow = null;
let dragState = null;
let zIndexCounter = 5;
let currentTheme = 'dark';
let currentOSMode = 'windows11';
let ecoTipIndex = 0;
const osModes = ['windows11', 'macos', 'linux'];

const pad = (n) => String(n).padStart(2, '0');

function initBootScreen() {
  const bootScreen = document.getElementById('boot-screen');
  const desktop = document.getElementById('desktop');
  if (!bootScreen || !desktop) return;

  setTimeout(() => {
    bootScreen.style.opacity = '0';
    bootScreen.style.pointerEvents = 'none';
    setTimeout(() => {
      bootScreen.style.display = 'none';
      desktop.style.display = 'grid';
    }, 900);
  }, 2400);
}

const appInitializers = {
  journal: loadNote,
  clock: updateClock,
  weather: updateWeather,
  palette: refreshPalette,
  dashboard: showDashboardStats,
  camera: startCamera,
  'search-engine': resetSearch,
  browser: loadBrowserHome
};

function openApp(appId) {
  const app = document.getElementById(appId);
  if (!app) return;

  if (app.dataset.windowState === 'minimized') {
    restoreApp(appId);
  }

  app.style.display = 'block';
  app.classList.add('active-window');
  app.style.zIndex = ++zIndexCounter;
  activeWindow = app;

  appInitializers[appId]?.();

  showDashboardStats();
  refreshTaskbarButtons();
}

function refreshTaskbarButtons() {
  document.querySelectorAll('#taskbar button[data-app]').forEach((button) => {
    const appId = button.dataset.app;
    const app = document.getElementById(appId);
    if (app && app.style.display === 'block') {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function minimizeApp(appId) {
  const app = document.getElementById(appId);
  if (!app) return;
  app.dataset.windowState = 'minimized';
  app.style.display = 'none';
  if (activeWindow === app) {
    activeWindow = null;
  }
  showDashboardStats();
  refreshTaskbarButtons();
}

function maximizeApp(appId) {
  const app = document.getElementById(appId);
  if (!app) return;

  if (app.dataset.windowState === 'maximized') {
    restoreApp(appId);
    return;
  }

  app.dataset.prevLeft = app.style.left || '';
  app.dataset.prevTop = app.style.top || '';
  app.dataset.prevWidth = app.style.width || '';
  app.dataset.prevHeight = app.style.height || '';
  app.dataset.prevMaxWidth = app.style.maxWidth || '';

  app.style.left = '20px';
  app.style.top = '20px';
  app.style.width = 'calc(100vw - 40px)';
  app.style.height = 'calc(100vh - 140px)';
  app.style.maxWidth = 'none';
  app.classList.add('maximized-window');
  app.dataset.windowState = 'maximized';
  app.style.display = 'block';
  app.style.zIndex = ++zIndexCounter;
  activeWindow = app;
  showDashboardStats();
  refreshTaskbarButtons();
}

function restoreApp(appId) {
  const app = document.getElementById(appId);
  if (!app) return;

  if (app.dataset.windowState === 'minimized') {
    app.style.display = 'block';
  }

  if (app.dataset.windowState === 'maximized') {
    if (app.dataset.prevLeft) {
      app.style.left = app.dataset.prevLeft;
    } else {
      app.style.left = '';
    }
    if (app.dataset.prevTop) {
      app.style.top = app.dataset.prevTop;
    } else {
      app.style.top = '';
    }
    if (app.dataset.prevWidth) {
      app.style.width = app.dataset.prevWidth;
    } else {
      app.style.width = '';
    }
    if (app.dataset.prevHeight) {
      app.style.height = app.dataset.prevHeight;
    } else {
      app.style.height = '';
    }
    if (app.dataset.prevMaxWidth) {
      app.style.maxWidth = app.dataset.prevMaxWidth;
    } else {
      app.style.maxWidth = '';
    }
    app.classList.remove('maximized-window');
  }

  app.dataset.windowState = 'normal';
  app.style.display = 'block';
  app.style.zIndex = ++zIndexCounter;
  activeWindow = app;
  showDashboardStats();
  refreshTaskbarButtons();
}

function closeApp(appId) {
  const app = document.getElementById(appId);
  if (!app) return;

  if (appId === 'camera') {
    stopCamera();
  }

  app.style.display = 'none';
  app.classList.remove('active-window');
  if (activeWindow === app) {
    activeWindow = null;
  }
  showDashboardStats();
  refreshTaskbarButtons();
}

function openFile(itemName) {
  const details = {
    Documents: 'Folder with your documents. Example files are simulated in this demo.',
    Music: 'No music files included in this demo, but you can imagine a playlist.',
    Pictures: 'Picture thumbnails would appear here in a real desktop.',
    'readme.txt': 'Welcome to the Windows 11 demo. Use the terminal and journal apps to explore.',
    'notes.txt': 'Your notes are stored locally in the browser when you save them.'
  };
  alert(`${itemName}\n\n${details[itemName] || 'This item is part of the demo explorer.'}`);
}

function updateTaskbarClock(now) {
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeNode = document.getElementById('taskbar-time');
  const dateNode = document.getElementById('taskbar-date');
  const macMenuTime = document.getElementById('mac-menu-time');
  if (timeNode) timeNode.textContent = time;
  if (dateNode) dateNode.textContent = date;
  if (macMenuTime) macMenuTime.textContent = time;
}

function enableDrag(app) {
  const header = app.querySelector('.app-header');
  if (!header) return;

  header.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    dragState = {
      app,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: parseInt(getComputedStyle(app).left, 10) || 0,
      originTop: parseInt(getComputedStyle(app).top, 10) || 0
    };
    app.setPointerCapture(event.pointerId);
  });

  header.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.app !== app) return;
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    app.style.left = `${dragState.originLeft + deltaX}px`;
    app.style.top = `${dragState.originTop + deltaY}px`;
  });

  header.addEventListener('pointerup', () => {
    dragState = null;
  });

  header.addEventListener('pointercancel', () => {
    dragState = null;
  });

  // Prevent buttons from triggering drag
  header.querySelectorAll('button').forEach(button => {
    button.addEventListener('pointerdown', (event) => {
      dragState = null;
      event.stopPropagation();
    });
  });
}

function initializeWindows() {
  document.querySelectorAll('.app-interface').forEach((app) => {
    enableDrag(app);
    attachWindowControls(app);
  });
}

function attachWindowControls(app) {
  const appId = app.id;
  const header = app.querySelector('.app-header');
  if (!header) return;

  const existingClose = header.querySelector('button');
  if (existingClose) {
    existingClose.classList.add('window-control', 'close-button');
    existingClose.title = 'Close';
    existingClose.removeAttribute('onclick');
    existingClose.addEventListener('click', () => closeApp(appId));
  }

  const controls = document.createElement('div');
  controls.className = 'window-controls';

  const minButton = document.createElement('button');
  minButton.className = 'window-control minimize-button';
  minButton.textContent = '–';
  minButton.title = 'Minimize';
  minButton.addEventListener('click', () => minimizeApp(appId));

  const maxButton = document.createElement('button');
  maxButton.className = 'window-control maximize-button';
  maxButton.textContent = '☐';
  maxButton.title = 'Maximize';
  maxButton.addEventListener('click', () => maximizeApp(appId));

  controls.appendChild(minButton);
  controls.appendChild(maxButton);

  if (existingClose) {
    header.insertBefore(controls, existingClose);
  } else {
    header.appendChild(controls);
  }
}

function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.icon:not(.dragging-icon)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function enableIconDrag(icon) {
  const container = document.getElementById('icons-row');
  if (!container) return;

  let dragState = null;
  let isDragging = false;

  icon.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (event.target.closest('button')) return;

    const rect = icon.getBoundingClientRect();
    dragState = {
      icon,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
      placeholder: document.createElement('div')
    };
    isDragging = false;
    icon.setPointerCapture(event.pointerId);
  });

  icon.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.icon !== icon) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;

    if (!isDragging && Math.hypot(dx, dy) > 10) {
      isDragging = true;
      const rect = icon.getBoundingClientRect();
      const placeholder = dragState.placeholder;
      placeholder.className = 'icon-placeholder';
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      icon.after(placeholder);
      icon.classList.add('dragging-icon');
      icon.style.position = 'fixed';
      icon.style.left = `${rect.left}px`;
      icon.style.top = `${rect.top}px`;
      icon.style.width = `${rect.width}px`;
      icon.style.zIndex = '999';
      icon.style.transition = 'transform 0.1s ease';
    }

    if (!isDragging) return;
    icon.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;

    const afterElement = getDragAfterElement(container, event.clientX);
    if (afterElement == null) {
      container.appendChild(dragState.placeholder);
    } else if (afterElement !== dragState.placeholder) {
      container.insertBefore(dragState.placeholder, afterElement);
    }
  });

  const finishIconDrag = () => {
    if (!dragState) return;
    if (isDragging) {
      icon.style.position = '';
      icon.style.left = '';
      icon.style.top = '';
      icon.style.width = '';
      icon.style.transform = '';
      icon.style.zIndex = '';
      icon.style.transition = '';
      icon.classList.remove('dragging-icon');

      const placeholder = dragState.placeholder;
      if (placeholder.parentNode) {
        placeholder.parentNode.insertBefore(icon, placeholder);
        placeholder.remove();
      }
    }

    if (dragState.icon) {
      dragState.icon.releasePointerCapture(dragState.pointerId);
    }
    dragState = null;
    isDragging = false;
  };

  icon.addEventListener('pointerup', finishIconDrag);
  icon.addEventListener('pointercancel', finishIconDrag);
}

function initIconDrag() {
  document.querySelectorAll('#icons-row .icon').forEach((icon) => {
    enableIconDrag(icon);
  });
}

function startClock() {
  const now = new Date();
  updateTaskbarClock(now);
  if (typeof updateClock === 'function') {
    updateClock();
  }
}

function copyToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard.');
    }).catch(() => {
      alert('Unable to copy automatically. Please copy manually.');
    });
    return;
  }

  alert(`Copy this text:\n${text}`);
}



function initApp() {
  initializeWindows();
  startClock();
  setInterval(startClock, 1000);

  const terminalInput = document.getElementById('terminal-input');
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runCommand();
      }
    });
  }

  initBootScreen();
  initIconDrag();
  showEcoTip();
  updateWeather();
  refreshPalette();
  applyOSMode();
  applyBackground();
  showDashboardStats();
  refreshTaskbarButtons();
}

window.addEventListener('DOMContentLoaded', initApp);
