// Enhanced Search Engine
const searchDatabase = {
  'windows 11': ['Official Windows 11 Site', 'Windows 11 Features Guide', 'Windows 11 System Requirements', 'Windows 11 Download'],
  'javascript': ['MDN JavaScript Guide', 'JavaScript Tutorials', 'JavaScript Best Practices', 'ECMAScript Specification'],
  'python': ['Python Official Site', 'Python Tutorials', 'Python Package Index', 'Django Framework'],
  'react': ['React Official Docs', 'React Tutorials', 'React Components Guide', 'React Hooks'],
  'html': ['HTML Specification', 'HTML Tutorials', 'HTML Best Practices', 'Semantic HTML Guide'],
  'css': ['CSS Specification', 'CSS Tutorials', 'CSS Flexbox Guide', 'CSS Grid Layout'],
  'web development': ['Web Development Roadmap', 'Frontend Development', 'Backend Development', 'Full Stack Development'],
  'ai': ['Artificial Intelligence Guide', 'Machine Learning', 'Deep Learning', 'AI Applications']
};

let searchResults = [];
let currentSearchQuery = '';

function performSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  currentSearchQuery = query;
  const results = document.getElementById('search-results');
  if (!results) return;

  // Look up in database
  const keywords = Object.keys(searchDatabase);
  const matchedKey = keywords.find(key => key.includes(query) || query.includes(key));
  
  let html = `<div style="padding:16px;">
    <h2>Search Results for: "${query}"</h2>
    <div style="color:#666;margin:16px 0;">About ${Math.floor(Math.random() * 900000) + 100000} results</div>`;

  if (matchedKey && searchDatabase[matchedKey]) {
    searchDatabase[matchedKey].forEach((result, i) => {
      const url = `https://www.result-${i}.com/search?q=${encodeURIComponent(query)}`;
      html += `
        <div style="background:#0a1a33;padding:16px;border-radius:8px;margin:12px 0;cursor:pointer;" 
             onmouseover="this.style.background='#1a3a52'" 
             onmouseout="this.style.background='#0a1a33'">
          <h3 style="margin:0 0 8px 0;color:#51cf66;font-size:18px;">${result}</h3>
          <p style="margin:0 0 8px 0;color:#74c0fc;font-size:12px;">${url}</p>
          <p style="margin:0;color:#a8d5ff;font-size:14px;line-height:1.5;">
            Information about "${query}". Click to visit the resource or learn more about this topic online.
          </p>
        </div>`;
    });
  } else {
    // Generic results for any search
    for (let i = 0; i < 5; i++) {
      const url = `https://www.example-${i}.com/search?q=${encodeURIComponent(query)}`;
      html += `
        <div style="background:#0a1a33;padding:16px;border-radius:8px;margin:12px 0;cursor:pointer;" 
             onmouseover="this.style.background='#1a3a52'" 
             onmouseout="this.style.background='#0a1a33'">
          <h3 style="margin:0 0 8px 0;color:#51cf66;font-size:18px;">${query} - Result ${i + 1}</h3>
          <p style="margin:0 0 8px 0;color:#74c0fc;font-size:12px;">${url}</p>
          <p style="margin:0;color:#a8d5ff;font-size:14px;line-height:1.5;">
            Find comprehensive information about "${query}". Browse through our collection of resources and learn more.
          </p>
        </div>`;
    }
  }

  html += `</div>`;
  results.innerHTML = html;
  searchInput.value = '';
}

function searchFromDesktop(query) {
  const searchWindow = document.getElementById('search-engine');
  if (searchWindow) {
    searchWindow.style.display = 'block';
    const input = document.getElementById('search-input');
    if (input) {
      input.value = query;
      performSearch();
    }
  }
}

function resetSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (input) input.value = '';
  if (results) results.innerHTML = `
    <div style="padding:32px;text-align:center;color:#666;">
      <h2>Search Engine</h2>
      <p>Enter a search term above to get started</p>
      <p style="font-size:12px;margin-top:20px;">Popular searches: Windows 11, JavaScript, Python, Web Development, AI</p>
    </div>`;
}

// Setup search on enter key
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  resetSearch();
});
