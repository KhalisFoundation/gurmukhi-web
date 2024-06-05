import React from 'react';
import { QuestionData } from 'types';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';
import ALL_CONSTANT from 'constants/constant';

const getQuestionElement = (
  questionData: QuestionData,
  currentQuestion: QuestionData | null,
  setIsCorrectOption: (value: boolean) => void,
  setIsOptionSelected: (value: boolean) => void,
): JSX.Element => {
  return (
    <MultipleChoiceQuestion
      questionData={questionData}
      hasImage={currentQuestion?.type === 'image'}
      setOptionSelected={setIsOptionSelected}
      setIsCorrectOption={setIsCorrectOption}
    />
  );
};
  
const renderFooter = (
  currentLevel: number,
  currentGamePosition: number,
  isCorrectOption: boolean | null,
  isOptionSelected: boolean | null,
): JSX.Element => {
  return (
    <LevelsFooter
      operation={isCorrectOption ? ALL_CONSTANT.NEXT : ALL_CONSTANT.INFORMATION}
      nextText={isCorrectOption === false ? ALL_CONSTANT.LEARN_MORE : ALL_CONSTANT.NEXT}
      currentLevel={currentLevel}
      currentGamePosition={
        isCorrectOption ? currentGamePosition + ALL_CONSTANT.DEFAULT_ONE : currentGamePosition
      }
      isDisabled={!isOptionSelected}
    />
  );
};

export {
  getQuestionElement,
  renderFooter,
};
