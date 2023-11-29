import React from 'react';
import LevelHexagon from '../levels/LevelHexagon';
import StartQuestionBtn from '../buttons/StartQuestionBtn';
import CONSTANTS from '@/constants';

interface Props {
  nextUrl: string;
  nextText?: string;
  absolute?: boolean;
}

export default function LevelsFooter({ nextUrl, nextText = 'Start Learning', absolute = false }: Props) {
  const totalNumQuestions = CONSTANTS.TOTAL_NUM_QUESTIONS;
  const currentQuestion = 5;
  const numQuestionsLeft = totalNumQuestions - currentQuestion;
  const footerClass = 'flex flex-row w-screen inset-x-0 bottom-0 bg-white/[.1] items-center justify-between p-12 z-10 ' + (absolute ? 'absolute' : 'static');
  return (
    <footer className={footerClass}>
      <div className="flex flex-col items-left justify-between">
        <h1 className='opacity-60 text-sm tracking-[.25rem] mb-2'>{numQuestionsLeft} {CONSTANTS.QUESTIONS_TO_GO}</h1>
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
      <StartQuestionBtn urlString={nextUrl} text={nextText} />
    </footer>
  );
}
