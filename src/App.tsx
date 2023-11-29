import React, { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Header from './components/header/Header';
import Login from './pages/login';
import routes from './constants/routes';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Defintion from './pages/word/definition';
import Examples from './pages/word/examples';
import CONSTANTS from './constants';
import RootLayout from './pages/layout';
import WordsPageLayout from './pages/word/layout';
import NotFound from './pages/not-found';
import Home from './pages/page';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path={routes.ROOT} element={<RootLayout />}>
        <Route path='' element={<Home />} />
        <Route path={routes.DASHBOARD} element={<Dashboard />} />
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.PROFILE} element={<Profile />} />
        <Route path={routes.SETTINGS} element={<Settings />} />
        <Route path={routes.WORD + '/*'} element={<WordsPageLayout />} >
          <Route path={routes.DEFINITION} element={<Defintion />} />
          <Route path={routes.EXAMPLES} element={<Examples />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>,
    ),
  );
  return (
    <Suspense fallback={<div>{CONSTANTS.LOADING}</div>}>
      <div className="App">
        <Header loggedIn={true} />
        <main className="flex h-screen flex-col justify-center overflow-y-scroll bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer">
          <RouterProvider router={router}></RouterProvider>
        </main>
      </div>
    </Suspense>
  );
}

export default App;
