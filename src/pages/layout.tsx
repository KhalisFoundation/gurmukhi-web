import React from 'react';
import { Outlet } from 'react-router-dom';
import CONSTANTS from '@/constants';
import Header from '@/components/header/Header';
import '@/styles/globals.scss';

export default function RootLayout() {
  return (
    <html lang="en">
      <head>
        <title>{CONSTANTS.TITLE}</title>
        <meta name="description" content={CONSTANTS.DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="flex h-screen flex-col justify-center overflow-y-scroll bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg background-layer">
          <Header />
          <Outlet />
        </main>
      </body>
    </html>
  );
}
