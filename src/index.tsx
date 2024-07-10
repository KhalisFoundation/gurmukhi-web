import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.scss';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from 'auth';
import { Provider } from 'react-redux';
import { store, persistor } from 'store/store';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthContextProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </AuthContextProvider>
    </Provider>
  </BrowserRouter>,
);
