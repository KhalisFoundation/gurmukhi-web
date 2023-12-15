import React from 'react';
import { useTranslation } from 'react-i18next';
import LevelHexagon from '../levels/LevelHexagon';
import StartQuestionBtn from '../buttons/StartQuestionBtn';

interface Props {
  nextUrl: string;
  nextText?: string;
  absolute?: boolean;
  completed?: boolean;
}

export default function LevelsFooter({ nextUrl, nextText = 'Start Learning', absolute = false, completed = false }: Props) {
  const { t: text } = useTranslation();
  const totalNumQuestions = Number(text('TOTAL_NUM_QUESTIONS'));
  const currentQuestion = 5;
  const numQuestionsLeft = totalNumQuestions - currentQuestion;
  const footerClass = 'flex flex-row w-screen sticky inset-x-0 bottom-0 bg-white/[.1] items-center justify-between p-8 z-10 ' + (absolute ? 'absolute' : 'static');
  return (
    <footer className={footerClass}>
      <div className="flex flex-col items-left justify-between gap-4">
        <h1 className='opacity-60 text-sm tracking-[.25rem] mb-2'>{numQuestionsLeft} {text('QUESTIONS_TO_GO')}</h1>
        <div className="flex flex-row gap-5">
          {Array.from(Array(totalNumQuestions).keys()).map((num) => {
            if (num < currentQuestion - 1) {
              return <LevelHexagon key={num} number={num + 1} type='completed' />;
            } else if (num === currentQuestion - 1) {
              return <LevelHexagon key={num} number={num + 1} type='current' />;
            } else {
              return <LevelHexagon key={num} number={num + 1} type='locked' />;
            }
          })}
        </div>
      </div>
      <StartQuestionBtn urlString={nextUrl} text={nextText} active={completed}/>
    </footer>
  );
}
