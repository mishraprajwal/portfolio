import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AboutPage from './AboutPage.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
// Read pathname, but prefer hash-based route if GitHub Pages 404 redirected here
let pathname = '/';
if (typeof window !== 'undefined') {
  // If the 404 redirect added a hash like #/about, prefer that
  const hash = window.location.hash || '';
  if (hash && hash.startsWith('#/')) pathname = hash.slice(1); // '/about'
  else pathname = window.location.pathname || '/';
}

root.render(
  <React.StrictMode>
    {pathname.startsWith('/about') ? <AboutPage /> : <App />}
  </React.StrictMode>
);

// debug mount
console.log('[app] mounting complete');
