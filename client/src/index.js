import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyTheme } from './theme';
import { installSessionGuard } from './session';
import './index.css';
import App from './App';

applyTheme();
installSessionGuard();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
