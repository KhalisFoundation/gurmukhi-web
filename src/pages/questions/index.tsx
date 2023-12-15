import React from 'react';
import { wordData } from 'constants/wordsData';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';
import { NewQuestionType, QuestionData } from 'types';

export default function Question() {
  const { t: text } = useTranslation();
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');
  const questionId = Number(searchParams.get('qid')) ?? 0;

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {}; 

  const getQuestionElement = (question: QuestionData) => {
    let questionData = { ...question, word: currentWord.word } as NewQuestionType;
    switch (question.type) {
      case 'image':
        questionData = { ...questionData, image: currentWord.image };
        return <MultipleChoiceQuestion question={questionData} hasImage={true}/>;
      default:
        return <MultipleChoiceQuestion question={questionData as NewQuestionType} />;
    }
  };

  const renderFooter = (word_id: number) => {
    if (word_id >= wordData.length - 1) {
      return <LevelsFooter nextUrl={ROUTES.DASHBOARD} nextText='Back to Dashboard' absolute={true} />;
    } else {
      const nextQuestionId = questionId + 1;
      if (currentWord.questions && nextQuestionId <= currentWord.questions.length - 1) {
        return <LevelsFooter nextUrl={`${ROUTES.QUESTION}?id=${word_id}&qid=${nextQuestionId}`} nextText='Next' />;
      } else {
        return <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=${word_id + 1}`} nextText='Next' />;
      }
    }
  };

  if (!currentWord.questions) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div>
      <div className='flex flex-col justify-center items-center gap-5'>
        <img className="w-1/3 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        {getQuestionElement(currentWord.questions[questionId])}
        <img className="w-1/3 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      {renderFooter(Number(wordId))}
    </div>
  );
}
