// Enhanced Terminal System
let currentDirectory = 'C:\\Users\\Win11';
let commandHistory = [];
let historyIndex = -1;
let terminalEnvironment = {
  USER: 'Win11',
  COMPUTERNAME: 'WINDOWS11-PC',
  OS: 'Windows 11',
  PATH: 'C:\\Windows\\System32;C:\\Program Files;C:\\Users\\Win11\\AppData\\Local\\Microsoft',
  SYSTEMROOT: 'C:\\Windows'
};

const advancedTerminalCommands = {
  help: () => `Windows 11 Terminal - Available Commands:
  
  Navigation:
    cd [path]           - Change directory
    dir                 - List directory contents
    pwd                 - Print working directory
  
  File Operations:
    type [file]         - Display file contents
    copy [src] [dst]    - Copy file
    del [file]          - Delete file
    mkdir [dir]         - Create directory
    rmdir [dir]         - Remove directory
  
  System Info:
    systeminfo          - Display system information
    date                - Show current date
    time                - Show current time
    whoami              - Display current user
    set                 - Display environment variables
  
  Utilities:
    echo [text]         - Print text
    cls                 - Clear screen
    ipconfig            - Display network info
    tasklist            - List running applications
    ver                 - Display OS version
    help                - Show this help message`,

  cls: () => { 
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '';
    return '';
  },

  clear: () => advancedTerminalCommands.cls(),

  pwd: () => currentDirectory,

  whoami: () => `${terminalEnvironment.COMPUTERNAME}\\${terminalEnvironment.USER}`,

  systeminfo: () => `
Windows 11 System Information:
  Computer Name: ${terminalEnvironment.COMPUTERNAME}
  OS Name: ${terminalEnvironment.OS}
  OS Version: 11.0.22000
  System Boot Time: ${new Date(Date.now() - Math.random() * 86400000).toLocaleString()}
  System Manufacturer: QEMU/VirtualBox
  System Model: Virtual PC
  Processor: Intel(R) Core(TM) i7 (Simulated)
  RAM: 8192 MB
  Time Zone: UTC-5`,

  date: () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  },

  time: () => {
    const now = new Date();
    return now.toLocaleTimeString();
  },

  ver: () => 'Microsoft Windows [Version 11.0.22000.1]',

  dir: (args) => {
    const contents = vfs.getDirectoryTree(currentDirectory);
    if (!contents) return 'Directory not found.';
    
    let output = `Directory of ${currentDirectory}\n\n`;
    let fileCount = 0;
    let folderCount = 0;
    
    contents.forEach(item => {
      if (item.isDirectory) {
        output += `[${item.name}]\n`;
        folderCount++;
      } else {
        output += `${item.name} ${item.size} bytes\n`;
        fileCount++;
      }
    });
    
    output += `\n${folderCount} Dir(s), ${fileCount} File(s)`;
    return output;
  },

  cd: (path) => {
    if (!path) return 'No path specified.';
    
    let newDir;
    if (path === '..') {
      const parts = currentDirectory.split('\\');
      if (parts.length > 1) {
        parts.pop();
        newDir = parts.join('\\');
      }
    } else if (path.startsWith('C:\\')) {
      newDir = path;
    } else {
      newDir = currentDirectory + '\\' + path;
    }
    
    const contents = vfs.listDirectory(newDir);
    if (contents !== null) {
      currentDirectory = newDir;
      return '';
    }
    return `The system cannot find the path specified.`;
  },

  type: (filename) => {
    if (!filename) return 'No filename specified.';
    
    const filePath = currentDirectory + '\\' + filename;
    const content = vfs.readFile(filePath);
    return content || `File not found: ${filename}`;
  },

  echo: (text) => text || '',

  ipconfig: () => `Ethernet adapter Ethernet:
   Connection-specific DNS Suffix . : localdomain
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Enabled. . . . . . . . . . . : Yes`,

  tasklist: () => `Image Name                     PID    Memory
========================== ======== ==========
System                         4     512 KB
explorer.exe                 1024     64 MB
svchost.exe                  2048     32 MB
notepad.exe                  3072     24 MB
paint.exe                    3080     48 MB
chrome.exe                   3096    128 MB`,

  set: () => Object.entries(terminalEnvironment).map(([key, value]) => `${key}=${value}`).join('\n'),

  mkdir: (dirname) => {
    if (!dirname) return 'No directory name specified.';
    if (vfs.createDirectory(currentDirectory + '\\' + dirname)) {
      return `Directory created successfully.`;
    }
    return 'Failed to create directory.';
  },

  del: (filename) => {
    if (!filename) return 'No file specified.';
    if (vfs.deleteFile(currentDirectory + '\\' + filename)) {
      return `File deleted successfully.`;
    }
    return `File not found: ${filename}`;
  },

  copy: (src, dst) => {
    if (!src || !dst) return 'Usage: copy [source] [destination]';
    const content = vfs.readFile(currentDirectory + '\\' + src);
    if (content) {
      vfs.createFile(currentDirectory + '\\' + dst, content);
      return `1 file(s) copied.`;
    }
    return `File not found: ${src}`;
  },

  calc: () => 'Calculator application opened. (Simulated)',

  notepad: () => 'Notepad application opened. (Simulated)',

  calc_expr: (expr) => {
    try {
      const safe = expr.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function(`"use strict"; return (${safe})`)();
      return `${safe} = ${result}`;
    } catch (e) {
      return 'Calculation error.';
    }
  },

  ping: (host) => {
    const hosts = { google: '142.250.185.46', github: '140.82.113.4', localhost: '127.0.0.1' };
    const ip = hosts[host?.toLowerCase()] || '8.8.8.8';
    return `Pinging ${host} [${ip}]... Success! Reply from ${ip}: time<1ms TTL=255`;
  },

  tree: () => {
    let output = currentDirectory + '\n';
    const contents = vfs.getDirectoryTree(currentDirectory);
    contents?.forEach(item => {
      output += (item.isDirectory ? '├── [' + item.name + ']\n' : '├── ' + item.name + '\n');
    });
    return output;
  },

  cls: () => {
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '';
    return '';
  },

  history: () => {
    if (commandHistory.length === 0) return 'No command history.';
    return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
  }
};

function appendTerminalLine(text) {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  if (text === '') return;

  const line = document.createElement('div');
  line.style.marginBottom = '4px';
  
  // Color code different types of output
  if (text.includes('error') || text.includes('Error') || text.includes('not found')) {
    line.style.color = '#ff6b6b';
  } else if (text.includes('successfully') || text.includes('Success')) {
    line.style.color = '#51cf66';
  } else if (text.includes('C:\\')) {
    line.style.color = '#74c0fc';
  }
  
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function runCommand() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const rawCommand = input.value.trim();
  if (!rawCommand) return;

  // Add to history
  commandHistory.push(rawCommand);
  historyIndex = commandHistory.length;

  // Display command
  const prompt = `${currentDirectory}> ${rawCommand}`;
  appendTerminalLine(prompt);

  // Parse command
  const [cmd, ...args] = rawCommand.split(' ');
  const cmdLower = cmd.toLowerCase();
  
  let response = '';

  // Handle commands
  if (advancedTerminalCommands[cmdLower]) {
    const result = advancedTerminalCommands[cmdLower](args.join(' '));
    response = result || '';
  } else {
    response = `'${cmd}' is not recognized as an internal or external command.`;
  }

  if (response) {
    appendTerminalLine(response);
  }

  input.value = '';
}

// Keyboard shortcuts in terminal
function setupTerminalShortcuts() {
  const input = document.getElementById('terminal-input');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else if (historyIndex === commandHistory.length - 1) {
        historyIndex++;
        input.value = '';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', setupTerminalShortcuts);
