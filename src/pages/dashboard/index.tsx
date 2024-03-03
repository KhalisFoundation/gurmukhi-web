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
import { useAppSelector } from 'store/hooks';
import useGamePlay from './hooks/useGamePlay1';
import Loading from 'components/loading';

export default function Dashboard() {
  const commonStyle =
    'w-3/12 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;
  const { user } = useUserAuth();
  const [ userData, setUserData ] = useState<any>(user);
  const [ isLoading, toggleLoading ] = useState<boolean>(true);
  const currentLevel: number = useAppSelector((state) => state.currentLevel);
  const currentGamePosition: number = useAppSelector((state) => state.currentGamePosition);
  const localState = useAppSelector((state) => state);
  useGamePlay(user, toggleLoading, user.uid && currentGamePosition === 0); // resetGame = true, resets the game on refresh or page change or after random word is viewed
  
  useEffect(() => {
    toggleLoading(true);
    if (user.uid) {
      toggleLoading(false);
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    console.log('currentLevel: ', currentLevel);
    console.log('currentGamePosition: ', currentGamePosition);
    console.log('localState: ', localState);
  }, [currentLevel, currentGamePosition, localState]);

  return (
    <div className='h-full flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta justify-center gap-10 h-4/5'>
        { isLoading ? 
          <Loading /> :
          <>
            <Ssa name={user.displayName && userData.displayName} />
            <div className='flex flex-row text-center justify-center gap-6 h-2/5'>
              <WordsSnippetBox commonStyle={commonStyle} />
              <CoinBox commonStyle={commonStyle} />
              <WordBox commonStyle={commonStyle} />
            </div>
          </>
        }
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
