import BackBtn from 'components/buttons/BackBtn';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function QuestionsPageLayout() {
  // check if children contains 
  return (
    <>
      <BackBtn />
      <div className='flex flex-col items-center justify-between gap-5 pb-0 h-full'>
        <div className='flex flex-col h-full relative items-center justify-around gap-5 w-full'>
          <Outlet />
        </div>
      </div>
    </>
  );
}
