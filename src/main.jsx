import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AboutPage from './AboutPage.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

root.render(
  <React.StrictMode>
    {pathname.startsWith('/about') ? <AboutPage /> : <App />}
  </React.StrictMode>
);

// debug mount
console.log('[app] mounting complete');
