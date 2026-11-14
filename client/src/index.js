import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyTheme } from './theme';
import { initTheme } from './themeMode';
import { installSessionGuard } from './session';
import './index.css';
import App from './App';

applyTheme();
initTheme();
installSessionGuard();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
