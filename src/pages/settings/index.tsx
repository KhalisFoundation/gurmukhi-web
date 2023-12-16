import React from 'react';
import { useTranslation } from 'react-i18next';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Settings() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.SETTINGS;
  return (
    <section className='flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute'>
      <Meta title={title} description={description} />
      {text('SETTINGS')}
    </section>
  );
}
