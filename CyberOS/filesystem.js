// Virtual File System for the OS
class VirtualFileSystem {
  constructor() {
    this.files = {};
    this.directories = {};
    this.initializeFilesystem();
  }

  initializeFilesystem() {
    // Create directory structure
    this.directories = {
      'C:\\Users\\Win11': {
        Documents: { readme: 'Welcome to Windows 11 Simulator!\n\nThis is a simulated Windows 11 operating system built with HTML, CSS, and JavaScript.', changelog: 'v1.0.0 - Initial Release' },
        Downloads: { info: 'Downloaded files appear here' },
        Pictures: { wallpaper: 'System wallpaper' },
        Music: { tune1: 'Cyber Waves', tune2: 'Neon Skyline' },
        Desktop: {}
      },
      'C:\\Program Files': {
        Notepad: 'Text Editor',
        Paint: 'Drawing Application',
        Terminal: 'Command Line'
      },
      'C:\\Windows': {
        System: 'System Files',
        Fonts: 'System Fonts'
      }
    };
  }

  listDirectory(path) {
    const parts = path.split('\\').filter(p => p);
    let current = this.directories;
    
    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  }

  createFile(path, content) {
    const lastSlash = path.lastIndexOf('\\');
    const dir = path.substring(0, lastSlash);
    const filename = path.substring(lastSlash + 1);
    
    const dirContents = this.listDirectory(dir);
    if (dirContents) {
      dirContents[filename] = content;
      return true;
    }
    return false;
  }

  readFile(path) {
    const lastSlash = path.lastIndexOf('\\');
    const dir = path.substring(0, lastSlash);
    const filename = path.substring(lastSlash + 1);
    
    const dirContents = this.listDirectory(dir);
    return dirContents && dirContents[filename] ? dirContents[filename] : null;
  }

  deleteFile(path) {
    const lastSlash = path.lastIndexOf('\\');
    const dir = path.substring(0, lastSlash);
    const filename = path.substring(lastSlash + 1);
    
    const dirContents = this.listDirectory(dir);
    if (dirContents && dirContents[filename]) {
      delete dirContents[filename];
      return true;
    }
    return false;
  }

  createDirectory(path) {
    const lastSlash = path.lastIndexOf('\\');
    const dir = path.substring(0, lastSlash);
    const dirname = path.substring(lastSlash + 1);
    
    const dirContents = this.listDirectory(dir);
    if (dirContents) {
      dirContents[dirname] = {};
      return true;
    }
    return false;
  }

  getDirectoryTree(path) {
    const contents = this.listDirectory(path);
    if (!contents) return null;
    
    return Object.keys(contents).map(name => ({
      name,
      isDirectory: typeof contents[name] === 'object' && contents[name] !== null && !Array.isArray(contents[name]),
      size: typeof contents[name] === 'string' ? contents[name].length : 'folder'
    }));
  }
}

// Global file system instance
const vfs = new VirtualFileSystem();
