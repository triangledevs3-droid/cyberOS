// Enhanced File Explorer
let explorerCurrentPath = 'C:\\Users\\Win11';
let explorerHistory = [];

function updateFileExplorer() {
  const fileList = document.querySelector('#file-explorer .app-body');
  if (!fileList) return;

  const contents = vfs.getDirectoryTree(explorerCurrentPath);
  if (!contents) {
    fileList.innerHTML = '<div class="file-item" style="color:#ff6b6b;">Directory not found</div>';
    return;
  }

  let html = `<div style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;gap:8px;align-items:center;">
    <button onclick="goBackExplorer()" style="padding:6px 12px;background:#1a3a52;border:1px solid rgba(255,255,255,0.2);border-radius:4px;color:#edf5ff;cursor:pointer;">← Back</button>
    <button onclick="goUpExplorer()" style="padding:6px 12px;background:#1a3a52;border:1px solid rgba(255,255,255,0.2);border-radius:4px;color:#edf5ff;cursor:pointer;">↑ Up</button>
    <span style="flex:1;color:#74c0fc;font-size:12px;">${explorerCurrentPath}</span>
  </div>`;

  contents.forEach(item => {
    const icon = item.isDirectory ? '📁' : '📄';
    html += `<div class="file-item" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);" 
             onmouseover="this.style.background='rgba(74, 144, 226, 0.1)'" 
             onmouseout="this.style.background=''" 
             ondblclick="${item.isDirectory ? `navigateToFolder('${item.name}')` : `openFile('${item.name}')`}">
      <span style="font-size:18px;">${icon}</span>
      <span style="flex:1;font-size:14px;">${item.name}</span>
      <span style="color:#666;font-size:12px;">${item.size !== 'folder' ? item.size + ' B' : 'Folder'}</span>
    </div>`;
  });

  fileList.innerHTML = html;
}

function navigateToFolder(folderName) {
  explorerHistory.push(explorerCurrentPath);
  explorerCurrentPath = explorerCurrentPath + '\\' + folderName;
  updateFileExplorer();
}

function goUpExplorer() {
  const parts = explorerCurrentPath.split('\\');
  if (parts.length > 1) {
    parts.pop();
    explorerCurrentPath = parts.join('\\');
    updateFileExplorer();
  }
}

function goBackExplorer() {
  if (explorerHistory.length > 0) {
    explorerCurrentPath = explorerHistory.pop();
    updateFileExplorer();
  }
}

function openFile(filename) {
  const content = vfs.readFile(explorerCurrentPath + '\\' + filename);
  if (content) {
    alert(`${filename}\n\n${content}`);
  }
}

function explorerRenameFile(oldName) {
  const newName = prompt('Enter new name:', oldName);
  if (newName && newName !== oldName) {
    const content = vfs.readFile(explorerCurrentPath + '\\' + oldName);
    if (content) {
      vfs.deleteFile(explorerCurrentPath + '\\' + oldName);
      vfs.createFile(explorerCurrentPath + '\\' + newName, content);
      updateFileExplorer();
    }
  }
}

function explorerCreateNewFolder() {
  const folderName = prompt('Enter folder name:');
  if (folderName) {
    vfs.createDirectory(explorerCurrentPath + '\\' + folderName);
    updateFileExplorer();
  }
}

function explorerCreateNewFile() {
  const fileName = prompt('Enter file name:');
  if (fileName) {
    vfs.createFile(explorerCurrentPath + '\\' + fileName, 'New file');
    updateFileExplorer();
  }
}

function explorerShowProperties() {
  const contents = vfs.getDirectoryTree(explorerCurrentPath);
  const fileCount = contents ? contents.filter(i => !i.isDirectory).length : 0;
  const folderCount = contents ? contents.filter(i => i.isDirectory).length : 0;
  
  alert(`Properties of: ${explorerCurrentPath}\n\nFolders: ${folderCount}\nFiles: ${fileCount}\n\nType: Directory\nLocation: Virtual File System`);
}

document.addEventListener('DOMContentLoaded', updateFileExplorer);
