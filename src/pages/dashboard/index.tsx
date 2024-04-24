import React, { useEffect, useState } from 'react';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import Ssa from 'components/ssa';
import WordsSnippetBox from './components/wordsSnippetBox';
import WordBox from './components/wordBox';
import CoinBox from './components/coinbox';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { useUserAuth } from 'auth';
import ALL_CONSTANT from 'constants/constant';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useGamePlay from './hooks/useGamePlay1';
import Loading from 'components/loading';
import Bugsnag from '@bugsnag/js';
import { setWebWorker } from 'store/features/webWorkerSlice';
import { User } from 'types/shabadavalidb';
import CONSTANTS from 'constants/constant';
import { updateUser, updateUserProperties } from 'utils/analytics';

export default function Dashboard() {
  const commonStyle =
    'w-5/6 lg:w-3/12 h-full cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;
  const { user } = useUserAuth();
  const [userData, setUserData] = useState<User>(user);
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [reloadPrompt, setReloadPrompt] = useState<boolean>(false);
  useGamePlay(user, toggleLoading);
  const currentLevel: number = useAppSelector((state) => state.currentLevel);
  const currentGamePosition: number = useAppSelector((state) => state.currentGamePosition);
  const webWorker: boolean = useAppSelector((state) => state.webWorker);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (webWorker) {
      dispatch(setWebWorker(false));
    }
    if (user) {
      setUserData(user);
      Bugsnag.setUser(user.uid, user.email, user.displayName);
      updateUser(user.uid);
      updateUserProperties({ email: user.email, displayName: user.displayName, uid: user.uid });
    }
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadPrompt(true);
    }, CONSTANTS.TIMEOUT_NUM);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className='h-screen overflow-y-auto lg:h-full lg:overflow-hidden flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta justify-center gap-10 h-4/5'>
        {isLoading ? (
          <div className='h-screen flex flex-col justify-center items-center'>
            <div className='text-[#0369a1] text-4xl font-bold mb-8'>Hold on tight, adventurer!</div>
            <div className='relative w-24 h-24'>
              <Loading />
            </div>
            <div className='text-[#0369a1] text-2xl font-bold mt-8'>
              Family of Raag rattans🎶 and celestial fairies✨ are singing shabads...
            </div>
            {reloadPrompt && (
              <div className='text-[#0369a1] text-2xl font-bold mt-8'>
                It is taking longer than expected🫨 Please reload the page💫
              </div>
            )}
          </div>
        ) : (
          <>
            <Ssa name={user.displayName && userData.displayName} />
            <div className='flex flex-col lg:flex-row text-center justify-center gap-6 h-full h-screen lg:h-3/5 w-full items-center'>
              <WordsSnippetBox commonStyle={commonStyle} />
              <CoinBox commonStyle={commonStyle} />
              <WordBox commonStyle={commonStyle} />
            </div>
          </>
        )}
      </div>
      <LevelsFooter
        operation={ALL_CONSTANT.START_QUESTION}
        currentGamePosition={currentGamePosition}
        currentLevel={currentLevel}
        isDisabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}
