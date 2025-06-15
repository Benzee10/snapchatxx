
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock process.env.API_KEY for browser environment if not set by a build tool
// In a real deployment, this should be handled by your environment/build process
if (typeof process === 'undefined') {
  (window as any).process = { env: { API_KEY: 'YOUR_GEMINI_API_KEY_HERE_OR_SET_VIA_ENV_VAR' } };
} else if (!process.env.API_KEY) {
  process.env.API_KEY = 'YOUR_GEMINI_API_KEY_HERE_OR_SET_VIA_ENV_VAR';
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
