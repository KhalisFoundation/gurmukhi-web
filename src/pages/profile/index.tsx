import React from 'react';
import CONSTANTS from 'constants';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t: text } = useTranslation();
  return (
    <section className="flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute">
      {text('PROFILE')}
    </section>
  );
}
