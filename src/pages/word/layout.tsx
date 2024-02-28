import React from 'react';
import { Outlet } from 'react-router-dom';
import EndSessionButton from 'components/buttons/EndSessionBtn';
import BackBtn from 'components/buttons/BackBtn';

export default function WordsPageLayout() {
  // check if children contains
  return (
    <>
      <div className=' flex-row flex justify-between mx-3'>
        <BackBtn navlink={-1} />
        <EndSessionButton className='' />
      </div>
      <div className='flex flex-col items-center justify-between gap-5 pb-0 h-full'>
        <Outlet />
      </div>
    </>
  );
}
