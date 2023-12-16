import React, { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import CONSTANTS from 'constants';
import Header from 'components/header/Header';
import Login from 'pages/login';
import { PAGES } from 'constants/routes';
import Dashboard from 'pages/dashboard';
import Profile from 'pages/profile';
import Settings from 'pages/settings';
import Defintion from 'pages/word/definition';
import Examples from 'pages/word/examples';
import RootLayout from 'pages/layout';
import WordsPageLayout from 'pages/word/layout';
import NotFound from 'pages/not-found';
import Home from 'pages/page';
import Semantics from 'pages/word/semantics';
import Information from 'pages/word/information';
import Win from 'pages/win';
import WinCoin from 'pages/wincoin';

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
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={PAGES.ROOT} element={<RootLayout />}>
        <Route path='' element={<Home />} />
        <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
        <Route path={PAGES.LOGIN} element={<Login />} />
        <Route path={PAGES.PROFILE} element={<Profile />} />
        <Route path={PAGES.SETTINGS} element={<Settings />} />
        <Route path={PAGES.WIN} element={<Win />} />
        <Route path={PAGES.WINCOIN} element={<WinCoin />} />
        <Route path={PAGES.WORDS} element={<WordsPageLayout />}>
          <Route path={PAGES.DEFINITION} element={<Defintion />} />
          <Route path={PAGES.EXAMPLES} element={<Examples />} />
          <Route path={PAGES.SEMANTICS} element={<Semantics />} />
          <Route path={PAGES.INFORMATION} element={<Information />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>,
    ),
  );
  return (
    <Suspense fallback={<div>{text('LOADING')}</div>}>
      <div className='App'>
        <Header loggedIn={true} />
        <main className='flex h-screen flex-col justify-center bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer'>
          <RouterProvider router={router}></RouterProvider>
        </main>
      </div>
    </Suspense>
  );
}

export default App;
