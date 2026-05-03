// Simple password validation (demo)
const demoPassword = 'admin';

function handleLogin() {
  const pwd = document.getElementById('login-password');
  if (!pwd) return;

  if (pwd.value === demoPassword) {
    completeLogin();
  } else {
    pwd.classList.add('error');
    pwd.value = '';
    setTimeout(() => pwd.classList.remove('error'), 500);
  }
}

function completeLogin() {
  const screen = document.getElementById('login-screen');
  if (screen) {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      document.getElementById('desktop').style.display = 'grid';
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('login-btn');
  const pwd = document.getElementById('login-password');
  
  if (btn) btn.addEventListener('click', handleLogin);
  if (pwd) {
    pwd.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }
});
