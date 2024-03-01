import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Gurfateh() {
  const { t: text } = useTranslation();

  return (
    <main className='relative flex lg:w-2/5 w-2/3 justify-center xl:justify-start self-center'>
      <div className='bg-slate-100/75 shadow rounded-3xl flex-col text-left gap-4 '>
        <div className='flex-grow w-2/3 m-auto my-2 p-3'>
          <h1 className='text-xl font-medium text-black text-left gurmukhi'>
            {text('GURFATEH_PUNJABI')}
          </h1>
          <p className='whitespace-pre-line'>{text('LOGIN_INFO')}</p>
        </div>
        <div className='relative'>
          <img
            className='w-auto h-auto md:rounded-none rounded-full mx-auto absolute bottom-0 -left-10'
            src={'/images/singhFateh.png'}
            alt='Singh Fateh'
            width={100}
            height={100}
          />
        </div>
      </div>
    </main>
  );
}
