import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import LevelHexagon from '../levels/LevelHexagon';
import { setWebWorker } from 'store/features/webWorkerSlice';
import StartQuestionBtn from '../buttons/StartQuestionBtn';
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
  isLoading: boolean | null;
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
  const nextSession = useAppSelector((state) => state.nextSession);
  const webWorker = useAppSelector((state) => state.webWorker);
  const dispatch = useAppDispatch();
  const totalNumQuestions = Number(text('TOTAL_NUM_QUESTIONS'));
  const numQuestionsLeft = totalNumQuestions - currentLevel;
  const footerClass =
    'gap-1 flex flex-col lg:flex-row w-full inset-x-0 bottom-0 bg-white/[.1] items-center justify-between z-10 box-border h-auto py-2 lg:py-4 ';
  const user = useAppSelector((state) => state.userData) as User;
  if (!user) {
    bugsnagErrorHandler(new Error('User not found'), 'LevelsFooter.tsx', {}, user);
  }

  useEffect(() => {
    const callWorker = async () => {
      dispatch(setWebWorker(true));
      await worker.fetchNextSessionData(user, nextSession, dispatch);
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
      <div className='flex gap-2 lg:hidden'>
        <p className='text-sm self-center brandon-grotesque'>
          {CONSTANTS.QUESTION_TITLECASE} {''}
          {Math.min(
            CONSTANTS.LEVELS_COUNT - numQuestionsLeft + CONSTANTS.DEFAULT_ONE,
            CONSTANTS.LEVELS_COUNT,
          )}
          / {CONSTANTS.LEVELS_COUNT}{' '}
        </p>
        <LevelHexagon
          key={CONSTANTS.LEVELS_COUNT - numQuestionsLeft}
          number={CONSTANTS.LEVELS_COUNT - numQuestionsLeft}
          type={'completed'}
          size={8}
        />
      </div>
      <div className='hidden lg:flex flex-col items-left justify-between gap-4 m-5 flex-wrap '>
        <h1 className='opacity-60 text-xs md:text-sm tracking-[.25rem] mb-2 text-center lg:text-left'>
          {numQuestionsLeft} {text('QUESTIONS_TO_GO')}
        </h1>
        <div className='flex flex-row gap-5 flex-wrap justify-center lg:justify-start'>
          {Array.from({ length: totalNumQuestions }).map((_, num) => (
            <LevelHexagon
              size={12}
              key={num}
              number={num + CONSTANTS.DEFAULT_ONE}
              type={getLevelType(num)}
            />
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
