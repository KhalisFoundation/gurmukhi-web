import React, { Suspense, useContext, useEffect } from 'react';
import {
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import Header from './components/header/Header';
import Login from './pages/login';
import { PAGES, ROUTES } from './constants/routes';
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
import Semantics from './pages/word/semantics';
import Information from './pages/word/information';
import RequireAuth from './components/require-auth';
import { AuthContext } from './auth/context';
import { UserAuthContextProvider } from './auth';

function App() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // NOTE: console log for testing purposes
  console.log('User:', !!currentUser);

  const requireAuth = (element: JSX.Element) => <RequireAuth>{element}</RequireAuth>;

  // Check if currentUser exists on initial render
  useEffect(() => {
    if (currentUser) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [currentUser]);

  return (
    <Suspense fallback={<div>{CONSTANTS.LOADING}</div>}>
      <UserAuthContextProvider>
        <div className="App">
          <Header />
          <main className="flex h-screen flex-col justify-center overflow-y-scroll bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer">
            <Routes>
              <Route path={PAGES.ROOT} element={<RootLayout />}>
                <Route path='' element={requireAuth(<Home />)} />
                <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
                <Route path={PAGES.LOGIN} element={<Login />} />
                <Route path={PAGES.PROFILE} element={requireAuth(<Profile />)} />
                <Route path={PAGES.SETTINGS} element={requireAuth(<Settings />)} />
                <Route path={PAGES.WORDS} element={requireAuth(<WordsPageLayout />)} >
                  <Route path={PAGES.DEFINITION} element={<Defintion />} />
                  <Route path={PAGES.EXAMPLES} element={<Examples />} />
                  <Route path={PAGES.SEMANTICS} element={<Semantics />} />
                  <Route path={PAGES.INFORMATION} element={<Information />} />
                </Route>
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </main>
        </div>
      </UserAuthContextProvider>
    </Suspense>
  );
}

export default App;
