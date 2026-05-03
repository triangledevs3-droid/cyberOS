function saveNote() {
  const textarea = document.getElementById('notepad-text');
  if (textarea) {
    localStorage.setItem('note', textarea.value);
    alert('Note saved.');
  }
}

function loadNote() {
  const textarea = document.getElementById('notepad-text');
  if (textarea) {
    const saved = localStorage.getItem('note');
    if (saved) textarea.value = saved;
  }
}

document.addEventListener('DOMContentLoaded', loadNote);