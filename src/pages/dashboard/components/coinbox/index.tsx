import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import ALL_CONSTANT from 'constants/constant';
import { getUserData } from 'database/shabadavalidb';
import { Counter } from '../Counter';
import { useUserAuth } from 'auth';
import { setNanakCoin } from 'store/features/nanakCoin';

function CoinBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  const { currentLevel } = useAppSelector((state) => state.progress);
  const nanakCoin: number = useAppSelector((state) => state.nanakCoin);
  const [coins, setCoins] = useState<number>(nanakCoin);
  const { user } = useUserAuth();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchCoins = async () => {
      const userData: any = await getUserData(user.uid);
      dispatch(setNanakCoin(userData.coins));
      setCoins(userData.coins);
    };
    fetchCoins();
  }, [user.uid]);
  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div>
          <img className='mx-auto my-2' src='/images/nanakCoin.png' alt='Nanak Coin' />
          <p className='font-serif text-sm text-sky-700 mb-2 my-0'>{text('COINS_DESC')}</p>
          <Counter n={coins} className='text-6xl text-sky-800' />
          <p className='font-serif text-sm text-slate-500 w-3/4 m-auto'>
            {ALL_CONSTANT.LEVELS_COUNT - currentLevel} {text('COINS_DESC2')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoinBox;
