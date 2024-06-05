import { useMemo } from 'react';
import { QuestionData } from 'types';
import { shuffleArray } from 'pages/dashboard/utils';

const useQuestionData = (currentQuestion: QuestionData | null) => {
  const memoizedQuestionData = useMemo(() => {
    if (currentQuestion?.options) {
      const correctOption = currentQuestion.options[currentQuestion.answer];
      const correctAnswer = typeof correctOption === 'string' ? correctOption : correctOption.word;
      const shuffledOptions = shuffleArray([...currentQuestion.options]);
      const answer = shuffledOptions.findIndex((option) => {
        if (typeof option === 'string') {
          return option === correctAnswer;
        } else {
          return option.word === correctAnswer;
        }
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

export default useQuestionData;