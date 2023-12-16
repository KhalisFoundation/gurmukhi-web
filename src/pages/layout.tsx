import React from 'react';
import Header from 'components/header/Header';
import 'styles/globals.scss';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { t: text } = useTranslation();
  return (
    <html lang='en'>
      <head>
        <title>{text('TITLE')}</title>
        <meta name='description' content={text('DESCRIPTION')} />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body>
        <main className='flex flex-col background-layer'>
          <div className='flex flex-col h-screen justify-start overflow-y-scroll bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg z-[1]'>
            <Header loggedIn={true} />
            <Outlet />
          </div>
        </main>
      </body>
    </html>
  );
}
