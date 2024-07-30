import React, { lazy } from 'react';
import 'styles/globals.scss';
import { Outlet } from 'react-router-dom';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { User } from 'types';
import { useAppSelector } from 'store/hooks';
const Header = lazy(() => import('components/header/Header'));
const FeedbackBtn = lazy(() => import('components/buttons/OpenFeedbackBtn'));

export default function RootLayout() {
  const { title, description } = metaTags.ROOT;
  const user = useAppSelector((state) => state.userData) as User;
  return (
    <main className='flex flex-col background-layer h-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col justify-start bg-cover bg-scroll bg-bottom bg-no-repeat shadow-lg z-[1] lg:h-full h-screen overflow-y-auto'>
        <Header loggedIn={!!user} />
        <Outlet />
        <FeedbackBtn />
      </div>
    </main>
  );
}
