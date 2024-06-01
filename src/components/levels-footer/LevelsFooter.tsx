import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from 'auth';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import LevelHexagon from '../levels/LevelHexagon';
import { setWebWorker } from 'store/features/webWorkerSlice';
import StartQuestionBtn from '../buttons/StartQuestionBtn';
import { getUserData } from 'database/shabadavalidb';
import CONSTANTS from 'constants/constant';
import { User } from 'types';
import { bugsnagErrorHandler } from 'utils';

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

const createWorker = createWorkerFactory(() => import('utils/webWorker'));
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
  const webWorker = useAppSelector((state) => state.webWorker);
  const dispatch = useAppDispatch();
  const totalNumQuestions = Number(text('TOTAL_NUM_QUESTIONS'));
  const numQuestionsLeft = totalNumQuestions - currentLevel;
  const footerClass =
    'flex flex-col-reverse lg:flex-row w-full inset-x-0 bottom-0 bg-white/[.1] items-center justify-between z-10 box-border h-auto py-4 ';
  const user = useUserAuth().user as User;
  if (!user) {
    bugsnagErrorHandler(new Error('User not found'), 'LevelsFooter.tsx', {}, user);
  }

  useEffect(() => {
    const callWorker = async () => {
      const userData = await getUserData(user.uid);
      dispatch(setWebWorker(true));
      if (!userData) {
        await worker.fetchNextSessionData(user, dispatch);
        return;
      }
      await worker.fetchNextSessionData(userData, dispatch);
    };
    if (currentLevel === CONSTANTS.WEB_WORKER_LEVEL && user.uid && !webWorker) {
      callWorker();
    }
  }, [currentLevel, user]);
  const getLevelType = (num: number) => {
    if (num < currentLevel) return 'completed';
    if (num === currentLevel) return 'current';
    return 'locked';
  };
  return (
    <footer className={footerClass}>
      <div className=' lg:flex flex-col items-left justify-between gap-4 m-5 flex-wrap'>
        <h1 className='opacity-60 text-xs md:text-sm tracking-[.25rem] mb-2 text-center lg:text-left'>
          {numQuestionsLeft} {text('QUESTIONS_TO_GO')}
        </h1>
        <div className='flex flex-row gap-5 flex-wrap justify-center lg:justify-start'>
          {Array.from({ length: totalNumQuestions }).map((_, num) => (
            <LevelHexagon key={num} number={num + CONSTANTS.DEFAULT_ONE} type={getLevelType(num)} />
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
