import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t: text } = useTranslation();
  return (
    <section className="flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute">
      {text('SETTINGS')}
    </section>
  );
}