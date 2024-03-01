import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Shabadavali() {
  const { t: text } = useTranslation();
  return (
    <div className='flex items-center justify-center md:w-12 md:h-12 w-5 h-5 mr-4 rounded-full logo-bg'>
      <span className='text-2xl text-white gurmukhi mustard'>{text('SHASHA')}</span>
    </div>
  );
}
