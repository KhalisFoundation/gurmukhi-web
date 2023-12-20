import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PAGES } from 'constants/routes';
import Login from 'pages/login';
import Dashboard from 'pages/dashboard';
import Profile from 'pages/profile';
import Settings from 'pages/settings';
import Defintion from 'pages/word/definition';
import Examples from 'pages/word/examples';
import WordsPageLayout from 'pages/word/layout';
import NotFound from 'pages/not-found';
import Home from 'pages/page';
import Semantics from 'pages/word/semantics';
import Information from 'pages/word/information';
import LogOut from 'components/signin/LogOut';
import RequireAuth from 'auth/require-auth';
import RootLayout from 'pages/layout';
import Win from 'pages/win';
import WinCoin from 'pages/wincoin';
import QuestionsPageLayout from 'pages/questions/layout';
import Question from 'pages/questions';

export const requireAuth = (children: JSX.Element) => <RequireAuth>{children}</RequireAuth>;

export function AppRouter() {
  return (
    <Routes>
      <Route path={PAGES.ROOT} element={<RootLayout />}>
        <Route path={''} element={<Home />} />
        <Route path={PAGES.DASHBOARD} element={requireAuth(<Dashboard />)} />
        <Route path={PAGES.LOGIN} element={<Login />} />
        <Route path={PAGES.LOG_OUT} element={requireAuth(<LogOut />)} />
        <Route path={PAGES.PROFILE} element={requireAuth(<Profile />)} />
        <Route path={PAGES.SETTINGS} element={requireAuth(<Settings />)} />
        <Route path={PAGES.WIN} element={requireAuth(<Win />)} />
        <Route path={PAGES.WINCOIN} element={requireAuth(<WinCoin />)} />
        <Route path={PAGES.WORDS} element={requireAuth(<WordsPageLayout />)}>
          <Route path={PAGES.DEFINITION} element={<Defintion />} />
          <Route path={PAGES.EXAMPLES} element={<Examples />} />
          <Route path={PAGES.SEMANTICS} element={<Semantics />} />
          <Route path={PAGES.INFORMATION} element={<Information />} />
        </Route>
        <Route path={PAGES.QUESTION} element={requireAuth(<QuestionsPageLayout />)}>
          <Route path={''} element={<Question />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}
