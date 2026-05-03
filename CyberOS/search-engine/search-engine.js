const samples = [
  { title: 'Windows 11 Help', snippet: 'Learn how to use the custom desktop apps.', url: '#' },
  { title: 'Search the Web', snippet: 'Search with a single click.', url: 'https://www.google.com/search?q=' },
  { title: 'Open Files', snippet: 'Use File Explorer to inspect demo files.', url: '#' },
  { title: 'Play Music', snippet: 'Use Music app for synth tones.', url: '#' }
];

function resetSearch() {
  const input = document.getElementById('search-query');
  const results = document.getElementById('search-results');
  if (input) input.value = '';
  if (results) results.innerHTML = '<div class="search-placeholder">Type a query and press Search.</div>';
}

function runSearch() {
  const input = document.getElementById('search-query');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  const query = input.value.trim();
  if (!query) {
    results.innerHTML = '<div class="search-placeholder">Enter something to search.</div>';
    return;
  }

  const filtered = samples.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.snippet.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    results.innerHTML = `<div class="search-placeholder">No results. <button onclick="open('${url}')">Search Google</button></div>`;
    return;
  }

  results.innerHTML = filtered.map(item => `
    <div class="search-result">
      <div class="search-result-title">${item.title}</div>
      <div class="search-result-snippet">${item.snippet}</div>
      ${item.url === '#' ? '' : `<button onclick="open('${item.url}${encodeURIComponent(query)}')">Open</button>`}
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', resetSearch);
