import React, { useEffect, useState } from 'react';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import Ssa from 'components/ssa';
import WordsSnippetBox from './components/wordsSnippetBox';
import WordBox from './components/wordBox';
import CoinBox from './components/coinbox';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { useAppSelector } from 'store/hooks';
import useFetchQuestions from './hooks/useFetchQuestions';
import { useUserAuth } from 'auth';

export default function Dashboard() {
  const commonStyle =
    'w-3/12 h-100 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200';
  const { title, description } = metaTags.DASHBOARD;

  const currentGamePosition: number = useAppSelector((state) => state.currentGamePosition);
  const currentLevel: number = useAppSelector((state) => state.currentLevel);
  const { user } = useUserAuth();
  const storeQuestions = useFetchQuestions(user);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const initialQuestionsFetch = async () => {
      setLoading(true);
      await storeQuestions(5);
      setLoading(false);
    };
    console.log(Object.keys(user));
    if (Object.keys(user).length !== 0 && user.progress) {
      console.log("it's running------");
      initialQuestionsFetch();
    }
  }, [user.progress]);
  return (
    <div className='h-full flex flex-col justify-between'>
      <Meta title={title} description={description} />
      <div className='flex flex-col text-center recoleta justify-center gap-10 h-4/5'>
        <Ssa name={user.displayName} />
        <div className='flex flex-row text-center justify-center gap-6 h-2/5'>
          <WordsSnippetBox commonStyle={commonStyle} />
          <CoinBox commonStyle={commonStyle} />
          <WordBox commonStyle={commonStyle} />
        </div>
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
