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
import useFetchWords from './hooks/useFetchWords';
import useGamePlay from './hooks/useGamePlay1';
import Bugsnag from '@bugsnag/js';
import { setWebWorker } from 'store/features/webWorkerSlice';
import { User, WordShabadavaliDB, WordType } from 'types';
import PageLoading from 'components/pageLoading';
import useNewWord from './hooks/useNewWord';
import useLearntWords from './hooks/useLearntWords';

export default function Dashboard() {
  const commonStyle =
    'w-[167px] h-[134px] md:w-[255px] md:h-[204px] xl:w-[380px] xl:h-[304px] md:grow-0 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;
  const user = useUserAuth().user as User;
  const [userData, setUserData] = useState<User>(user);
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [isFetchWordsLoading, toggleFetchWords] = useState<boolean>(true);
  const [isGamePlayLoading, toggleGamePlayLoading] = useState<boolean>(true);
  const [isLearntWords, toggleLearntWords] = useState<boolean>(true);
  const [isNewWord, toggleNewWord] = useState<boolean>(true);
  useFetchWords(user, toggleFetchWords);
  useGamePlay(user, toggleGamePlayLoading);
  const randomWord: WordType | null = useNewWord(user, toggleNewWord);
  const learntWords: WordShabadavaliDB[] | null = useLearntWords(user, toggleLearntWords);
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
    }
  }, [user]);

  useEffect(() => {
    // Update overall loading state based on individual states
    if (!isFetchWordsLoading && !isGamePlayLoading && !isLearntWords && !isNewWord) {
      toggleLoading(false);
    }
  }, [isFetchWordsLoading, isGamePlayLoading, isNewWord, isLearntWords]);

  return (
    <div className='h-full lg:overflow-hidden flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta justify-center gap-10 h-4/5'>
        {isLoading ? (
          <PageLoading />
        ) : (
          <>
            <Ssa name={user.displayName && userData.displayName} />
            <div className='flex flex-wrap text-center justify-center gap-6 items-center'>
              <WordsSnippetBox commonStyle={commonStyle} wordsLearnt={learntWords} />
              <CoinBox commonStyle={commonStyle} />
              <WordBox commonStyle={commonStyle} randomWord={randomWord} />
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
