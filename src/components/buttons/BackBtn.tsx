import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

interface BackProps {
  navlink?: number;
}

export default function BackBtn({ navlink }: BackProps) {
  const { t: text } = useTranslation();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        if (navlink) {
          navigate(navlink);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      }}
      className='flex ml-5 items-center gap-1 brandon-grotesque'
    >
      <FontAwesomeIcon icon={faChevronLeft} className='w-3 h-3' />
      <span className='text-base text-xs md:text-sm text-black'>{text('BACK')}</span>
    </button>
  );
}
