import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LevelHexagon from '../levels/LevelHexagon';
import { useAppSelector } from 'store/hooks';
import { useUserAuth } from 'auth';
import StartQuestionBtn from '../buttons/StartQuestionBtn';
import { countQuestionKeys } from 'utils';
import useFetchQuestions from 'pages/dashboard/hooks/useFetchQuestions';
import ALL_CONSTANT from 'constants/constant';

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

export default function LevelsFooter({
  operation,
  currentGamePosition,
  currentLevel,
  nextText = 'Start Learning',
  absolute = false,
  completed = false,
  isDisabled,
  isLoading = false,
}: Props) {
  const { t: text } = useTranslation();
  const totalNumQuestions = Number(text('TOTAL_NUM_QUESTIONS'));
  const numQuestionsLeft = totalNumQuestions - currentLevel;
  const gameArray = useAppSelector((state) => state.gameArray);
  const footerClass =
    'flex flex-row w-full sticky inset-x-0 bottom-0 bg-white/[.1] items-center justify-between z-10 box-border' +
    (absolute ? 'absolute' : 'static');
  const user = useUserAuth();
  const storeQuestions = useFetchQuestions(user);

  useEffect(() => {
    if (gameArray.length / 2 === currentGamePosition) {
      const questionCount = countQuestionKeys(gameArray);
      storeQuestions(ALL_CONSTANT.LEVELS_COUNT - questionCount);
    }
  }, [gameArray]);
  const getLevelType = (num: number) => {
    if (num < currentLevel) return 'completed';
    if (num === currentLevel) return 'current';
    return 'locked';
  };
  return (
    <footer className={footerClass}>
      <div className='flex flex-col items-left justify-between gap-4 m-5'>
        <h1 className='opacity-60 text-sm tracking-[.25rem] mb-2'>
          {numQuestionsLeft} {text('QUESTIONS_TO_GO')}
        </h1>
        <div className='flex flex-row gap-5'>
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
