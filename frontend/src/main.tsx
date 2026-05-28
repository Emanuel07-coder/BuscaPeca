console.log("DEBUG Vercel URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("DEBUG Vercel Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

