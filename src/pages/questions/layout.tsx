import React from 'react';
import { Outlet } from 'react-router-dom';
import EndSessionButton from 'components/buttons/EndSessionBtn';

export default function QuestionsPageLayout() {
  // check if children contains
  return (
    <>
      <EndSessionButton className='text-right mx-4' />
      <div className='flex flex-col items-center justify-between gap-5 pb-0 h-full'>
        <div className='flex flex-col h-full relative items-center justify-around gap-5 w-full'>
          <Outlet />
        </div>
      </div>
    </>
  );
}
