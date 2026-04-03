import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

console.log("main.tsx executing...");

// Top-level error catcher for local debugging
window.addEventListener('error', (event) => {
  console.error('TOP-LEVEL ERROR:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED REJECTION:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
console.log("main.tsx render called.");
