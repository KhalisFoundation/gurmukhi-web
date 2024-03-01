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
    'w-5/6 lg:w-3/12 h-full cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;
  const { user } = useUserAuth();
  const [userData, setUserData] = useState<any>(user);
  const [isLoading, toggleLoading] = useState<boolean>(true);
  useGamePlay(user, toggleLoading);
  const currentLevel: number = useAppSelector((state) => state.currentLevel);
  const currentGamePosition: number = useAppSelector((state) => state.currentGamePosition);

  useEffect(() => {
    if (!user) {
      toggleLoading(true);
      return;
    } else {
      toggleLoading(false);
      setUserData(user);
    }
  }, [user]);

  return (
    <div className='h-screen overflow-y-auto lg:h-full lg:overflow-hidden flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta items-center justify-center gap-10 lg:h-4/5 my-10'>
        {isLoading ? (
          <Loading />
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
