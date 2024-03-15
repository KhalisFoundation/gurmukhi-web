import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import ALL_CONSTANT from 'constants/constant';
import { Counter } from '../Counter';

function CoinBox({ commonStyle, nanakCoin }: { commonStyle: string, nanakCoin: number}) {
  const { t: text } = useTranslation();
  const currentLevel = useAppSelector((state) => state.currentLevel);
  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div>
          <img className='mx-auto my-2' src='/images/nanakCoin.png' alt='Nanak Coin' />
          <p className='font-serif text-sm text-sky-700 mb-2 my-0'>{text('COINS_DESC')}</p>
          <Counter n={nanakCoin} className='text-6xl text-sky-800' />
          <p className='font-serif text-sm text-slate-500 w-3/4 m-auto'>
            {ALL_CONSTANT.LEVELS_COUNT - currentLevel} {text('COINS_DESC2')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoinBox;
