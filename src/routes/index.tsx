import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PAGES, ROUTES } from 'constants/routes';
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
        <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
        <Route path={PAGES.LOGIN} element={<Login />} />
        <Route path={PAGES.LOG_OUT} element={<LogOut />} />
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
        <Route path={PAGES.QUESTION} element={<QuestionsPageLayout />}>
          <Route path={''} element={<Question />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}
