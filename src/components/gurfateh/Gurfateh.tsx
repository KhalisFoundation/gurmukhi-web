import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Gurfateh() {
  const { t: text } = useTranslation();

  return (
    <main className='relative flex lg:w-2/5 md:w-2/3 justify-center xl:justify-start self-center'>
      <div className='bg-[#d6e9f3] drop-shadow-xl rounded-[50px] flex-col text-left gap-4 w-2/3'>
        <div className='flex-grow w-3/4 m-auto my-2 p-4 md:p-10'>
          <h1 className='text-lg font-medium text-left text-[#333] gurmukhi'>
            {text('GURFATEH_PUNJABI')}
          </h1>
          <p className='text-lg text-[#1F4860] mt-2 leading-none'>{text('LOGIN_INFO')}</p>
        </div>
        <div className='relative'>
          <img
            className='w-auto h-auto md:rounded-none rounded-full mx-auto absolute -bottom-1 -left-10'
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
