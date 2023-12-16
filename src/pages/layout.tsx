import React from 'react';
import Header from 'components/header/Header';
import 'styles/globals.scss';
import { Outlet } from 'react-router-dom';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function RootLayout() {
  const { title, description } = metaTags.ROOT;
  return (
    <html lang='en'>
      <Meta title={title} description={description} />
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
