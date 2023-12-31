import React from 'react';
import Header from 'components/header/Header';
import 'styles/globals.scss';
import { Outlet } from 'react-router-dom';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { useUserAuth } from 'auth';

export default function RootLayout() {
  const { title, description } = metaTags.ROOT;
  const { user } = useUserAuth();
  return (
    <main className='flex flex-col background-layer'>
      <Meta title={title} description={description} />
      <div className='flex flex-col h-screen justify-start bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg z-[1]'>
        <Header loggedIn={!!user} />
        <Outlet />
      </div>
    </main>
  );
}
