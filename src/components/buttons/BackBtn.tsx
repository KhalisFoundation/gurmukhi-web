import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import CONSTANTS from '@/constants';

export default function BackBtn() {
  return (
    <a href="/dashboard" className='flex w-fit absolute inset-x-6 top-24 items-center gap-1 brandon-grotesque'>
      <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
      <span className="text-base text-black">{CONSTANTS.BACK}</span>
    </a>
  );
}
