import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyTheme } from './theme';
import './index.css';
import App from './App';

applyTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
