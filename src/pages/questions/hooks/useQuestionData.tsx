import { useMemo } from 'react';
import { Option, QuestionData } from 'types';
import { shuffleArray } from 'pages/dashboard/utils';

const getOptionValue = (option: string | Option) => {
  if (typeof option === 'string') {
    return option;
  }
  return option.word ?? option.option;
};

const useQuestionData = (currentQuestion: QuestionData | null) => {
  const memoizedQuestionData = useMemo(() => {
    if (currentQuestion?.options) {
      const correctOption = currentQuestion.options[currentQuestion.answer];
      const correctAnswer = getOptionValue(correctOption);
      const shuffledOptions = shuffleArray([...currentQuestion.options]);
      const answer = shuffledOptions.findIndex((option) => {
        const optionValue = getOptionValue(option);
        return optionValue === correctAnswer;
      });
      const newQData = {
        ...currentQuestion,
        options: shuffledOptions,
        answer,
      } as QuestionData;
      return newQData;
    }
    return { ...currentQuestion } as QuestionData;
  }, [currentQuestion]);
  return memoizedQuestionData;
};

export { getOptionValue, useQuestionData };