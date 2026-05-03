const fileInfo = {
  Documents: 'Folder with your documents. Example files simulated.',
  Music: 'No music files in this demo.',
  Pictures: 'Picture thumbnails would appear here.',
  'readme.txt': 'Welcome to Windows 11 demo. Use terminal and journal to explore.',
  'notes.txt': 'Your notes are stored locally in the browser.'
};

function openFile(name) {
  const info = fileInfo[name] || 'This item is part of the demo.';
  alert(`${name}\n\n${info}`);
}
