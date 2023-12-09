import React, { Suspense, useContext, useEffect } from 'react';
import {
  useNavigate,
} from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import CONSTANTS from './constants';
import { ROUTES } from './constants/routes';
import RequireAuth from './auth/require-auth';
import { AuthContext } from './auth/context';
import { UserAuthContextProvider } from './auth';
import RootLayout from 'pages/layout';
import { AppRouter } from 'routes';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...CONSTANTS,
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

function App() {
  const { currentUser } = useContext(AuthContext);
  const { t: text } = useTranslation();

  // NOTE: console log for testing purposes
  console.log('User:', !!currentUser);

  return (
    <Suspense fallback={<div>{text('LOADING')}</div>}>
      <UserAuthContextProvider>
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </UserAuthContextProvider>
    </Suspense>
  );
}

export default App;
