import Meta from 'components/meta';
import metaTags from 'constants/meta';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function WordsPageLayout() {
  // check if children contains
  const { title, description } = metaTags.WORD;
  return (
    <div className='flex flex-col items-center justify-between gap-5 p-12 pb-0'>
      <Meta title={title} description={description} />
      <Outlet />
    </div>
  );
}
