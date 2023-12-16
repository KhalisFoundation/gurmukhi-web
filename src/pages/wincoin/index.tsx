import React from 'react';
import { useTranslation } from 'react-i18next';

function WinCoin() {
  const { t: text } = useTranslation();
  return (
    <div className='nanakback h-full bg-cover w-full'>
      <div className='flex flex-col text-center justify-evenly h-4/5 recoleta'>
        <div className=' mx-auto bg-cyan-50 w-1/4 rounded-xl'>
          <img
            className='mx-auto my-2 w-1/2 mt-10'
            src='/images/nanakcoinlg.png'
            alt='Nanak Coin'
          />
          <p className='text-3xl text-sky-800'>{text('GREAT_JOB')}</p>
          <p className='text-xl mb-10 text-sky-800'>{text('NANAK_COIN_DESC')}</p>
          <button className='bg-sky-900 text-xs text-white p-3 mb-20 tracking-widest font-light '>
            {text('GET_ONE_MORE')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default WinCoin;
