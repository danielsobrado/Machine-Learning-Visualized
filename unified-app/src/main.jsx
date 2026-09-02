import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// Loaded after index.css so the lesson composition layer wins ties with the
// surface-normalisation rules it builds on.
import './_design-system/notebook-lesson.css';
import './styles/cloudflare-theme.css';

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
