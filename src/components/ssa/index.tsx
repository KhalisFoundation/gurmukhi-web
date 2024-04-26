import React from 'react';
import { ROUTES } from 'constants/routes';
import { useTranslation } from 'react-i18next';

export default function Ssa({ name }: { name: string }) {
  const { t: text } = useTranslation();
  return (
    <div>
      <p className='text-2xl lg:text-3xl text-[#112D3D]'>
        <span className='font-medium gurmukhi'>{text('SSA_PUNJABI')}</span>{' '}
        <span className='cormont-garamond-light capitalize'>
          <a href={ROUTES.PROFILE}>{name}</a>
        </span>
      </p>
    </div>
  );
}
