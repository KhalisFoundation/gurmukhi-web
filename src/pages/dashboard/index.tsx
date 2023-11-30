import React from 'react';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import CONSTANTS from '@/constants';
import { ROUTES } from '@/constants/routes';

export default function Dashboard() {

  return (
    <div className='h-full'>
      <div className='flex flex-col text-center justify-evenly h-4/5'>{CONSTANTS.DASHBOARD}</div>
      <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=1`} />
    </div>
  );
}
