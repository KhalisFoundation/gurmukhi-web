import React from 'react';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import CONSTANTS from '@/constants';

export default function Dashboard() {

  return (
    <div className='h-full'>
      <div className='flex flex-col text-center justify-evenly h-4/5'>{CONSTANTS.DASHBOARD}</div>
      <LevelsFooter nextUrl='/word/definition?id=1' />
    </div>
  );
}
