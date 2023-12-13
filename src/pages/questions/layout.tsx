import BackBtn from 'components/buttons/BackBtn';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function QuestionsPageLayout() {
  // check if children contains 
  return (
    <div className="flex flex-col items-center justify-between gap-5 p-12 pb-0">
      <div className="flex flex-col static h-screen items-center justify-around gap-5">
        <BackBtn />
        <Outlet />
      </div>
    </div>
  );
}
