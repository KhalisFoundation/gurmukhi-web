import React from 'react';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { ROUTES } from 'constants/routes';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t: text } = useTranslation();

  return (
    <div className='h-full'>
      <div className='flex flex-col text-center justify-evenly h-4/5'>{text('DASHBOARD')}</div>
      <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=1`} />
    </div>
  );
}
