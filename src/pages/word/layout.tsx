import React from 'react';
import { Outlet } from 'react-router-dom';
import EndSessionButton from 'components/buttons/EndSessionBtn';

export default function WordsPageLayout() {
  // check if children contains
  return (
    <>
      <div className='flex flex-col items-center justify-between gap-5 pb-0 h-full'>
        <EndSessionButton className='self-end absolute right-9 z-10' />
        <Outlet />
      </div>
    </>
  );
}
