import React from 'react';
import { Outlet } from 'react-router-dom';

export default function WordsPageLayout() {
  // check if children contains 
  return (
    <div className="flex flex-col items-center justify-between gap-5 p-12 pb-0">
      <Outlet />
    </div>
  );
}
