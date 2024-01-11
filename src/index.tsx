import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'auth/context';
import { Provider } from 'react-redux';
import { store } from 'store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </BrowserRouter>,
);
