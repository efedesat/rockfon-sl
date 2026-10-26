import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { applyVisibility } from './content.js';
import App from './App.jsx';
import './styles.css';

// Hidden chapters, topics and tools (phased launch) must be applied before the
// first render. Use the copy cached from the last visit straight away and
// refresh it in the background; only the very first visit waits for the server,
// briefly. If the server can't be reached, everything shows.
const CACHE = 'playbook-visibility';
const readCache = () => { try { const v = JSON.parse(localStorage.getItem(CACHE)); return Array.isArray(v) ? v : null; } catch { return null; } };
const writeCache = v => { try { localStorage.setItem(CACHE, JSON.stringify(v)); } catch { /* storage unavailable */ } };

const fetchHidden = timeout => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  return fetch('/api/visibility', { cache: 'no-store', signal: ctrl.signal })
    .then(r => (r.ok ? r.json() : null))
    .then(d => (d && Array.isArray(d.hidden) ? d.hidden : null))
    .catch(() => null)
    .finally(() => clearTimeout(t));
};

function render() {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </React.StrictMode>
  );
}

const cached = readCache();
if (cached) {
  applyVisibility(cached);
  render();
  fetchHidden(8000).then(h => { if (h) writeCache(h); });
} else {
  fetchHidden(2500).then(h => {
    if (h) { writeCache(h); applyVisibility(h); }
    render();
  });
}
