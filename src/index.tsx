import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
