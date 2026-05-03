const homeHTML = `<html><body style="margin:0;padding:32px;font-family:Segoe UI, sans-serif;background:#071029;color:#edf5ff;"><h1>Welcome to Win11 Browser</h1><p>Enter a website or search term above and press Go.</p></body></html>`;

function loadBrowserHome() {
  const frame = document.getElementById('browser-frame');
  if (frame) {
    frame.src = '';
    frame.srcdoc = homeHTML;
  }
  const input = document.getElementById('browser-url');
  if (input) input.value = '';
}

// Alias for the button onclick handler
function navigateBrowserHome() {
  loadBrowserHome();
}

function navigateBrowser() {
  const input = document.getElementById('browser-url');
  const frame = document.getElementById('browser-frame');
  if (!input || !frame) return;

  let url = input.value.trim();
  if (!url) return;

  const hasProtocol = /^https?:\/\//i.test(url);
  const isURL = /^([\w-]+\.)+[\w-]+/.test(url);

  if (hasProtocol || isURL) {
    const fullURL = hasProtocol ? url : `https://${url}`;
    // Clear srcdoc and set src to navigate to the URL
    frame.removeAttribute('srcdoc');
    frame.src = fullURL;
  } else {
    const searchURL = encodeURIComponent(url);
    // Clear src and set srcdoc for search results
    frame.src = '';
    frame.srcdoc = `<html><body style="margin:0;padding:32px;font-family:Segoe UI, sans-serif;background:#071029;color:#edf5ff;"><h1>Search Results</h1><p>Searching for: <strong>${url}</strong></p><p style="margin-top:20px;">This is a simulated search. Search results are displayed here within the browser.</p><p>Keywords: ${url.split(' ').slice(0,3).join(', ')}</p><p style="margin-top:20px;color:#7dc7ff;"><em>In a real browser, actual search engine results would appear here.</em></p></body></html>`;
  }
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

document.addEventListener('DOMContentLoaded', loadBrowserHome);
