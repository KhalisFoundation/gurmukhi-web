import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

export default function BackBtn() {
  const { t: text } = useTranslation();
  const navigate = useNavigate();
  return (
    <button onClick={() => {
      navigate(ROUTES.DASHBOARD);
    }} className='flex w-fit absolute inset-x-6 top-24 items-center gap-1 brandon-grotesque'>
      <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
      <span className="text-base text-black">{text('BACK')}</span>
    </button>
  );
}
