// Enhanced Browser System
class BrowserTab {
  constructor(id, title = 'New Tab') {
    this.id = id;
    this.title = title;
    this.url = 'about:blank';
    this.history = [];
    this.historyIndex = -1;
  }

  addToHistory(url) {
    // Remove any forward history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(url);
    this.historyIndex = this.history.length - 1;
    this.url = url;
  }

  back() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.url = this.history[this.historyIndex];
      return this.url;
    }
    return null;
  }

  forward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.url = this.history[this.historyIndex];
      return this.url;
    }
    return null;
  }
}

class BrowserManager {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.tabCounter = 0;
    this.bookmarks = [
      { title: 'Google', url: 'google.com' },
      { title: 'Wikipedia', url: 'wikipedia.org' },
      { title: 'GitHub', url: 'github.com' },
      { title: 'Stack Overflow', url: 'stackoverflow.com' },
      { title: 'MDN Web Docs', url: 'developer.mozilla.org' }
    ];
    this.downloads = [];
    this.createNewTab();
  }

  createNewTab() {
    const id = this.tabCounter++;
    const tab = new BrowserTab(id);
    this.tabs.push(tab);
    this.activeTabId = id;
    return tab;
  }

  getActiveTab() {
    return this.tabs.find(t => t.id === this.activeTabId);
  }

  closeTab(id) {
    this.tabs = this.tabs.filter(t => t.id !== id);
    if (this.activeTabId === id && this.tabs.length > 0) {
      this.activeTabId = this.tabs[0].id;
    }
    return this.tabs.length > 0;
  }

  navigateTo(url) {
    const tab = this.getActiveTab();
    if (!tab) return;

    tab.addToHistory(url);
  }

  goBack() {
    const tab = this.getActiveTab();
    if (!tab) return null;
    return tab.back();
  }

  goForward() {
    const tab = this.getActiveTab();
    if (!tab) return null;
    return tab.forward();
  }

  addBookmark(title, url) {
    this.bookmarks.push({ title, url });
  }

  getBookmarks() {
    return this.bookmarks;
  }
}

// Global browser manager
const browserManager = new BrowserManager();

// Enhanced browser functions
function navigateBrowserEnhanced(url) {
  const input = document.getElementById('browser-url');
  const frame = document.getElementById('browser-frame');
  if (!input || !frame) return;

  let targetUrl = url || input.value.trim();
  if (!targetUrl) return;

  const hasProtocol = /^https?:\/\//i.test(targetUrl);
  const isURL = /^([\w-]+\.)+[\w-]+/.test(targetUrl);

  if (hasProtocol || isURL) {
    const fullURL = hasProtocol ? targetUrl : `https://${targetUrl}`;
    browserManager.navigateTo(fullURL);
    frame.removeAttribute('srcdoc');
    frame.src = fullURL;
    if (input) input.value = fullURL;
  } else {
    // Search query - display in app
    const searchQuery = encodeURIComponent(targetUrl);
    browserManager.navigateTo(`search:${targetUrl}`);
    frame.src = '';
    frame.srcdoc = generateSearchResults(targetUrl, searchQuery);
    if (input) input.value = targetUrl;
  }
}

function generateSearchResults(query, encoded) {
  const keywords = query.split(' ').slice(0, 5).join(', ');
  return `<html><body style="margin:0;padding:32px;font-family:Segoe UI, sans-serif;background:#071029;color:#edf5ff;">
<h1>Search Results</h1>
<p>Searching for: <strong>${query}</strong></p>
<div style="margin-top:20px;">
<div style="background:#0a1a33;padding:16px;border-radius:8px;margin:10px 0;">
  <h3 style="margin:0 0 8px 0;">Result 1: ${query}</h3>
  <p style="margin:0;color:#74c0fc;font-size:12px;">https://www.example-result-1.com/search?q=${encoded}</p>
  <p style="margin:8px 0 0 0;color:#a8d5ff;font-size:14px;">Find information about "${query}" from various sources.</p>
</div>
<div style="background:#0a1a33;padding:16px;border-radius:8px;margin:10px 0;">
  <h3 style="margin:0 0 8px 0;">Result 2: ${query} Guide</h3>
  <p style="margin:0;color:#74c0fc;font-size:12px;">https://www.example-result-2.com/guide/${encoded}</p>
  <p style="margin:8px 0 0 0;color:#a8d5ff;font-size:14px;">A comprehensive guide about "${query}".</p>
</div>
<div style="background:#0a1a33;padding:16px;border-radius:8px;margin:10px 0;">
  <h3 style="margin:0 0 8px 0;">Result 3: ${query} Tips</h3>
  <p style="margin:0;color:#74c0fc;font-size:12px;">https://www.example-result-3.com/tips/${encoded}</p>
  <p style="margin:8px 0 0 0;color:#a8d5ff;font-size:14px;">Tips and tricks about "${query}".</p>
</div>
<p style="margin-top:30px;color:#666;font-size:12px;">Keywords: ${keywords}</p>
</div>
</body></html>`;
}

function browserGoBack() {
  const url = browserManager.goBack();
  if (url) {
    const frame = document.getElementById('browser-frame');
    const input = document.getElementById('browser-url');
    if (url.startsWith('search:')) {
      const query = url.substring(7);
      const encoded = encodeURIComponent(query);
      frame.src = '';
      frame.srcdoc = generateSearchResults(query, encoded);
      if (input) input.value = query;
    } else {
      frame.removeAttribute('srcdoc');
      frame.src = url;
      if (input) input.value = url;
    }
  }
}

function browserGoForward() {
  const url = browserManager.goForward();
  if (url) {
    const frame = document.getElementById('browser-frame');
    const input = document.getElementById('browser-url');
    if (url.startsWith('search:')) {
      const query = url.substring(7);
      const encoded = encodeURIComponent(query);
      frame.src = '';
      frame.srcdoc = generateSearchResults(query, encoded);
      if (input) input.value = query;
    } else {
      frame.removeAttribute('srcdoc');
      frame.src = url;
      if (input) input.value = url;
    }
  }
}

function showBookmarks() {
  const bookmarks = browserManager.getBookmarks();
  let html = '<html><body style="margin:0;padding:32px;font-family:Segoe UI, sans-serif;background:#071029;color:#edf5ff;"><h1>Bookmarks</h1>';
  
  bookmarks.forEach((bm, i) => {
    html += `<div style="background:#0a1a33;padding:12px;border-radius:8px;margin:10px 0;cursor:pointer;" onclick="navigateBrowserEnhanced('${bm.url}')">
      <strong style="color:#51cf66;">⭐ ${bm.title}</strong>
      <p style="margin:4px 0 0 0;color:#74c0fc;font-size:12px;">${bm.url}</p>
    </div>`;
  });
  
  html += '</body></html>';
  
  const frame = document.getElementById('browser-frame');
  if (frame) {
    frame.src = '';
    frame.srcdoc = html;
  }
}

// Override the original functions
const originalNavigateBrowser = navigateBrowser;
function navigateBrowser() {
  navigateBrowserEnhanced();
}

function navigateBrowserHome() {
  const frame = document.getElementById('browser-frame');
  const input = document.getElementById('browser-url');
  if (frame) {
    frame.src = '';
    frame.srcdoc = homeHTML;
  }
  if (input) input.value = '';
}

function refreshBrowser() {
  const frame = document.getElementById('browser-frame');
  if (!frame) return;
  try {
    frame.contentWindow.location.reload();
  } catch (e) {
    if (frame.srcdoc) frame.srcdoc = frame.srcdoc;
  }
}
