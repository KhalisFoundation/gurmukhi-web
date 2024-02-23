import React from 'react';
import { useTranslation } from 'react-i18next';
import seed0 from 'data/seed0.json';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

function Win() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.WIN;
  return (
    <div className='h-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center justify-evenly h-4/5 recoleta'>
        <div>
          <div className='flex justify-center items-center m-auto winbadge bg-no-repeat w-full bg-center'>
            <p className='gurmukhi text-6xl text-yellow-800'>{text('PUNJABI_5')}</p>
          </div>
          <p className='text-5xl text-sky-800 mb-3'>{text('GREAT_JOB')}</p>
          <p className='text-3xl text-sky-800 mb-8'>{text('FIFTH_QUESTION')}</p>
          <p className='text-medium text-slate-500 w-1/5 m-auto'>
            {seed0.length} {text('QUESTIONS_TO_GO')}
          </p>
        </div>
      </div>
    </div>
  );
}
export default Win;
