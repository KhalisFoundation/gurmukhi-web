import React, { lazy, useEffect, useState } from 'react';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import useGamePlay from './hooks/useGamePlay';
import Bugsnag from '@bugsnag/js';
import { setWebWorker } from 'store/features/webWorkerSlice';
import { User, WordShabadavaliDB, WordType } from 'types';
import useLearntWords from './hooks/useLearntWords';
import { getRandomWord } from './utils';

const Ssa = lazy(() => import('components/ssa'));
const WordBox = lazy(() => import('./components/wordBox'));
const WordsSnippetBox = lazy(() => import('./components/wordsSnippetBox'));
const LevelsFooter = lazy(() => import('components/levels-footer/LevelsFooter'));
const CoinBox = lazy(() => import('./components/coinbox'));
const PageLoading = lazy(() => import('components/pageLoading'));

export default function Dashboard() {
  const commonStyle =
    'w-[167px] h-[134px] md:w-[255px] md:h-[204px] xl:w-[380px] xl:h-[304px] md:grow-0 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;
  const user = useAppSelector((state) => state.userData) as User;
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [isGamePlayLoading, toggleGamePlayLoading] = useState<boolean>(true);
  const [isLearntWords, toggleLearntWords] = useState<boolean>(true);
  const currentGamePosition: number = useAppSelector((state) => state.currentGamePosition);
  const currentLevel: number = useAppSelector((state) => state.currentLevel);
  useGamePlay(user, currentGamePosition, currentLevel, toggleGamePlayLoading);
  const gameArray = useAppSelector((state) => state.gameArray);
  const randomWord: WordType | null = getRandomWord(gameArray);
  const learntWords: WordShabadavaliDB[] | null = useLearntWords(user, toggleLearntWords);
  const webWorker: boolean = useAppSelector((state) => state.webWorker);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (webWorker) {
      dispatch(setWebWorker(false));
    }
    if (user) {
      Bugsnag.setUser(user.uid, user.email, user.displayName);
    }
  }, [user]);

  useEffect(() => {
    // Update overall loading state based on individual states
    if (!isGamePlayLoading && !isLearntWords) {
      toggleLoading(false);
    }
  }, [isGamePlayLoading, isLearntWords]);

  return (
    <div className='h-full lg:overflow-hidden flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta justify-center gap-10 h-4/5'>
        {isLoading ? (
          <PageLoading />
        ) : (
          <>
            <Ssa name={user.displayName} />
            <div className='flex flex-wrap text-center justify-center gap-6 items-center'>
              <WordsSnippetBox commonStyle={commonStyle} wordsLearnt={learntWords} />
              <CoinBox commonStyle={commonStyle} />
              {randomWord && <WordBox commonStyle={commonStyle} randomWord={randomWord} />}
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
