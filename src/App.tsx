import React, { Suspense, useContext } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import CONSTANTS from './constants';
import { AuthContext } from './auth/context';
import { UserAuthContextProvider } from './auth';
import { AppRouter } from 'routes';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

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
  const { title, description } = metaTags.ROOT;

  // NOTE: console log for testing purposes
  console.log('User:', !!currentUser);

  return (
    <Suspense fallback={<div>{text('LOADING')}</div>}>
      <UserAuthContextProvider>
        <div className='App'>
          <Meta title={title} description={description} />
          <main className='flex h-screen flex-col justify-center overflow-y-scroll bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer'>
            <AppRouter />
          </main>
        </div>
      </UserAuthContextProvider>
    </Suspense>
  );
}

export default App;
