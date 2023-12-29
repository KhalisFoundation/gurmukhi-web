import React from 'react';
import { useTranslation } from 'react-i18next';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { useUserAuth } from 'auth';

export default function Profile() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.PROFILE;
  const { user } = useUserAuth();

  return (
    <section className='flex flex-row w-full h-full justify-between gap-5 p-12'>
      <Meta title={title} description={description} />
      <div className='flex flex-col items-left gap-5'>
        <h1 className='title'>{text('PROFILE')}</h1>
        <div className='flex flex-col'>
          <span>{user.displayName}</span>
          <span>{text('EMAIL')}: {user.email}</span>
        </div>
      </div>
    </section>
  );
}
