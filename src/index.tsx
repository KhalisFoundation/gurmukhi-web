import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.scss';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'auth/context';
import { Provider } from 'react-redux';
import { store, persistor } from 'store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </AuthProvider>
  </BrowserRouter>,
);
