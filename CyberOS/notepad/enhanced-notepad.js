// Enhanced Notepad
let notepadDocuments = {};
let currentNoteId = null;
let noteCounter = 1;

function createNewNote() {
  const noteId = `note_${noteCounter++}`;
  const title = prompt('Enter document name:') || `Untitled${noteCounter}`;
  notepadDocuments[noteId] = {
    title: title,
    content: '',
    lastSaved: new Date()
  };
  currentNoteId = noteId;
  loadNoteIntoEditor(noteId);
  updateNotepadDocumentList();
}

function loadNoteIntoEditor(noteId) {
  const note = notepadDocuments[noteId];
  if (!note) return;

  const textarea = document.getElementById('notepad-text');
  if (textarea) {
    textarea.value = note.content;
  }
  currentNoteId = noteId;
  updateNotepadTitle();
}

function updateNotepadTitle() {
  const note = notepadDocuments[currentNoteId];
  const titleEl = document.querySelector('#notepad .app-header span');
  if (titleEl && note) {
    titleEl.textContent = `📝 Notepad - ${note.title}`;
  }
}

function updateNotepadDocumentList() {
  const docList = document.getElementById('notepad-documents');
  if (!docList) return;

  let html = '<div style="border-bottom:1px solid rgba(255,255,255,0.1);padding:8px;">';
  Object.entries(notepadDocuments).forEach(([id, note]) => {
    const isActive = id === currentNoteId ? 'background:#1a3a52;' : '';
    html += `<div style="padding:6px;cursor:pointer;border-radius:4px;${isActive}" 
             onclick="loadNoteIntoEditor('${id}')" 
             oncontextmenu="event.preventDefault(); deleteNote('${id}')">
      ${note.title}
    </div>`;
  });
  html += '</div>';
  docList.innerHTML = html;
}

function saveNote() {
  if (!currentNoteId) {
    alert('No document is open.');
    return;
  }

  const textarea = document.getElementById('notepad-text');
  const note = notepadDocuments[currentNoteId];

  if (!textarea || !note) return;

  note.content = textarea.value;
  note.lastSaved = new Date();

  // Also save to localStorage
  localStorage.setItem(`notepad_${currentNoteId}`, JSON.stringify(note));
  alert(`Saved: ${note.title}`);
}

function loadNote() {
  // Try to load from localStorage
  const stored = localStorage.getItem('notepad_documents');
  if (stored) {
    try {
      const docs = JSON.parse(stored);
      notepadDocuments = docs;
      if (Object.keys(docs).length > 0) {
        const firstId = Object.keys(docs)[0];
        loadNoteIntoEditor(firstId);
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
  } else {
    // Create a default note
    const defaultId = 'note_welcome';
    notepadDocuments[defaultId] = {
      title: 'Welcome',
      content: 'Welcome to Enhanced Notepad!\n\n- Create new documents\n- Save your work\n- Multiple documents support\n- Auto-save to localStorage',
      lastSaved: new Date()
    };
    currentNoteId = defaultId;
  }

  updateNotepadDocumentList();
  if (currentNoteId) {
    loadNoteIntoEditor(currentNoteId);
  }
}

function deleteNote(noteId) {
  if (confirm('Delete this note?')) {
    delete notepadDocuments[noteId];
    if (currentNoteId === noteId) {
      const remaining = Object.keys(notepadDocuments)[0];
      if (remaining) {
        loadNoteIntoEditor(remaining);
      } else {
        currentNoteId = null;
      }
    }
    updateNotepadDocumentList();
  }
}

function notepadFindAndReplace() {
  const find = prompt('Find:');
  if (!find) return;

  const textarea = document.getElementById('notepad-text');
  if (!textarea) return;

  const replace = prompt('Replace with (leave empty to just find):');
  if (replace === null) return;

  const text = textarea.value;
  const newText = text.replaceAll(find, replace || '');
  
  if (newText !== text) {
    textarea.value = newText;
    const count = (text.split(find).length - 1);
    alert(`Replaced ${count} occurrence(s).`);
  } else {
    alert('Text not found.');
  }
}

function notepadWordCount() {
  const textarea = document.getElementById('notepad-text');
  if (!textarea) return;

  const text = textarea.value.trim();
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const lines = text.split('\n').length;

  alert(`Statistics:\n\nWords: ${words}\nCharacters: ${chars}\nLines: ${lines}`);
}

function notepadAutoSave() {
  if (!currentNoteId) return;

  const textarea = document.getElementById('notepad-text');
  const note = notepadDocuments[currentNoteId];

  if (!textarea || !note) return;

  note.content = textarea.value;
  localStorage.setItem('notepad_documents', JSON.stringify(notepadDocuments));
}

// Auto-save every 30 seconds
setInterval(notepadAutoSave, 30000);

document.addEventListener('DOMContentLoaded', loadNote);
