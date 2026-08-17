import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import './index.css';
import App from './App.jsx';

import '@progress/kendo-theme-default/dist/all.css';

createRoot(document.getElementById('root')).render(<App />);
