import React, { Suspense } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import CONSTANTS from './constants';
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
  const { t: text } = useTranslation();
  const { title, description } = metaTags.ROOT;

  return (
    <Suspense fallback={<div>{text('LOADING')}</div>}>
      <div className='App h-full'>
        <UserAuthContextProvider>
          <div className='h-full'>
            <Meta title={title} description={description} />
            <main className='flex flex-col bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer h-full'>
              <AppRouter />
            </main>
          </div>
        </UserAuthContextProvider>
      </div>
    </Suspense>
  );
}

export default App;
