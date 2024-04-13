import React, { useEffect, useState } from 'react';
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
import { useUserAuth } from 'auth';
import {
  getUserData,
  updateNanakCoin,
  updateNextSession,
  updateProgress,
} from 'database/shabadavalidb';
import { resetGameArray } from 'store/features/gameArraySlice';
import ALL_CONSTANT from 'constants/constant';
import handleClick from 'components/buttons/hooks/useOnClick';
import LoaderButton from 'components/buttons/LoaderButton';
import { addScreens } from 'store/features/gameArraySlice';
import { GameScreen, User } from 'types/shabadavalidb';

function WinCoin() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { t: text } = useTranslation();
  const dispatch = useAppDispatch();
  const { title, description } = metaTags.WIN;
  const nanakCoin = useAppSelector((state) => state.nanakCoin);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const [isLoading, toggleIsLoading] = useState<boolean>(true);
  const [nextSession, setNextSession] = useState<GameScreen[]>([]);

  useEffect(() => {
    const storeData = async () => {
      toggleIsLoading(true);
      if (currentLevel === ALL_CONSTANT.LEVELS_COUNT) {
        dispatch(resetGamePosition());
        dispatch(resetGameArray());
        const data: User | undefined = await getUserData(user.uid);
        const nxtSession = data?.nextSession || [];
        console.log(data?.nextSession);
        setNextSession(nxtSession);
        dispatch(increment());
        dispatch(resetLevel());
        dispatch(addScreens(nxtSession));
        await updateNanakCoin(user.uid, nanakCoin + 1);
        await updateProgress(user.uid, 0, nxtSession, 0);
        await updateNextSession(user.uid, []);
      }
      toggleIsLoading(false);
    };
    storeData();
  }, [user.uid]);

  return (
    <div className='nanakback h-full bg-cover w-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center justify-evenly h-4/5 recoleta'>
        <div className='mx-auto bg-cyan-50 w-5/6 md:w-2/4 rounded-xl xl:w-1/4 '>
          <img
            className='mx-auto my-2 w-1/2 mt-10'
            src='/images/nanakcoinlg.png'
            alt='Nanak Coin'
          />
          <p className='text-3xl text-sky-800'>{text('GREAT_JOB')}</p>
          <p className='text-xl mb-10 text-sky-800'>{convertNumber(nanakCoin)}</p>
          <div className='flex flex-col w-1/2 m-auto justify-evenly mb-10 gap-4'>
            <button
              disabled={isLoading && nextSession.length === 0}
              onClick={() =>
                handleClick(
                  0,
                  ALL_CONSTANT.GET_ONE_MORE,
                  currentLevel,
                  nextSession,
                  navigate,
                  user,
                  dispatch,
                )
              }
              className='bg-sky-900 text-xs text-white p-3  tracking-widest font-light '
            >
              {isLoading ? <LoaderButton theme={ALL_CONSTANT.LIGHT} /> : ALL_CONSTANT.GET_ONE_MORE}
            </button>
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className='bg-sky-100 border-sky-900 border-2 text-xs text-sky-900 p-3  tracking-widest font-light'
            >
              {ALL_CONSTANT.END_SESSION}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WinCoin;
