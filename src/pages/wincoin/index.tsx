import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { resetLevel } from 'store/features/currentLevelSlice';
import { resetGamePosition } from 'store/features/currentGamePositionSlice';
import { increment } from 'store/features/nanakCoin';
import convertNumber from 'utils/utils';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

function WinCoin() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.WIN;
  const dispatch = useAppDispatch();
  const nanakCoin = useAppSelector((state) => state.nanakCoin);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(increment());
    dispatch(resetGamePosition());
    dispatch(resetLevel());
  }, []);
  return (
    <div className='nanakback h-full bg-cover w-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center justify-evenly h-4/5 recoleta'>
        <div className=' mx-auto bg-cyan-50 w-1/4 rounded-xl'>
          <img
            className='mx-auto my-2 w-1/2 mt-10'
            src='/images/nanakcoinlg.png'
            alt='Nanak Coin'
          />
          <p className='text-3xl text-sky-800'>{text('GREAT_JOB')}</p>
          <p className='text-xl mb-10 text-sky-800'>{convertNumber(nanakCoin)}</p>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className='bg-sky-900 text-xs text-white p-3 mb-20 tracking-widest font-light '
          >
            {text('GET_ONE_MORE')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default WinCoin;
