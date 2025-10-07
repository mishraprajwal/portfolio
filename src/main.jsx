import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AboutPage from './AboutPage.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

const getPathname = () => {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash || '';
  if (hash && hash.startsWith('#/')) return hash.slice(1);
  return window.location.pathname || '/';
};

const renderApp = () => {
  const pathname = getPathname();
  root.render(
    <React.StrictMode>
      {pathname.startsWith('/about') ? <AboutPage /> : <App />}
    </React.StrictMode>
  );
};

// initial render
renderApp();

// Re-render when hash changes (enables hash-based client navigation)
window.addEventListener('hashchange', () => {
  try { renderApp(); } catch (e) { console.error('renderApp failed on hashchange', e); }
});

// debug mount
console.log('[app] mounting complete');
