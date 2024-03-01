import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from 'auth';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import LevelHexagon from '../levels/LevelHexagon';
import StartQuestionBtn from '../buttons/StartQuestionBtn';
import { getUserData } from 'database/shabadavalidb';

interface Props {
  operation: string;
  nextText?: string;
  absolute?: boolean;
  completed?: boolean;
  currentGamePosition: number;
  currentLevel: number;
  isDisabled: boolean;
  isLoading?: boolean;
}

const createWorker = createWorkerFactory(() => import('utils/serviceWorker'));
export default function LevelsFooter({
  operation,
  currentGamePosition,
  currentLevel,
  nextText = 'Start Learning',
  completed = false,
  isDisabled,
  isLoading = false,
}: Props) {
  const { t: text } = useTranslation();
  const worker = useWorker(createWorker);
  const totalNumQuestions = Number(text('TOTAL_NUM_QUESTIONS'));
  const numQuestionsLeft = totalNumQuestions - currentLevel;
  const { user } = useUserAuth();
  const footerClass =
    'flex flex-col-reverse lg:flex-row w-full inset-x-0 bottom-0 bg-white/[.1] items-center justify-between z-10 box-border h-auto py-4 ';

  useEffect(() => {
    const callWorker = async () => {
      console.log('worker is running');
      const userData = await getUserData(user.uid);
      if (!userData) {
        await worker.fetchNextSessionData(user);
        return;
      }
      await worker.fetchNextSessionData(userData);
    };
    if (currentLevel === 10 && user.uid && worker) {
      callWorker();
    }
  }, [currentLevel, user, worker]);
  const getLevelType = (num: number) => {
    if (num < currentLevel) return 'completed';
    if (num === currentLevel) return 'current';
    return 'locked';
  };
  return (
    <footer className={footerClass}>
      <div className='flex flex-col items-left justify-between gap-4 m-5 flex-wrap'>
        <h1 className='opacity-60 text-sm tracking-[.25rem] mb-2 text-center lg:text-left'>
          {numQuestionsLeft} {text('QUESTIONS_TO_GO')}
        </h1>
        <div className='flex flex-row gap-5 flex-wrap justify-center lg:justify-start'>
          {Array.from({ length: totalNumQuestions }).map((_, num) => (
            <LevelHexagon key={num} number={num + 1} type={getLevelType(num)} />
          ))}
        </div>
      </div>
      <StartQuestionBtn
        operation={operation}
        text={nextText}
        active={completed}
        currentGamePosition={currentGamePosition}
        isDisabled={isDisabled}
        isLoading={isLoading}
      />
    </footer>
  );
}
