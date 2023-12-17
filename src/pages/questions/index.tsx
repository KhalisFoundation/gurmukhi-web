import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';
import { NewQuestionType, QuestionData } from 'types';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Question() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.QUESTION;
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
        return <MultipleChoiceQuestion question={questionData} hasImage={true} />;
      default:
        return <MultipleChoiceQuestion question={questionData as NewQuestionType} />;
    }
  };

  const renderFooter = (word_id: number) => {
    if (word_id >= wordData.length - 1) {
      return <LevelsFooter nextUrl={ROUTES.DASHBOARD} nextText='Back to Dashboard' />;
    } else {
      const nextQuestionId = questionId + 1;
      if (currentWord.questions && nextQuestionId <= currentWord.questions.length - 1) {
        return (
          <LevelsFooter
            nextUrl={`${ROUTES.QUESTION}?id=${word_id}&qid=${nextQuestionId}`}
            nextText='Next'
          />
        );
      } else {
        return (
          <LevelsFooter
            nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=${word_id + 1}`}
            nextText='Next'
          />
        );
      }
    }
  };

  if (!currentWord.questions) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }


  return (
    <div className='flex flex-col h-screen'>
      <Meta title={title} description={description} />
      <div className='flex-1 flex-col overflow-y-auto'>
        <div className='flex flex-col items-center justify-center gap-5'>
          <img
            className='w-1/3 h-6'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
          {getQuestionElement(currentWord.questions[questionId])}
          <img
            className='w-1/3 h-6 rotate-180'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
        </div>
      </div>
      {renderFooter(Number(wordId))}
    </div>
  );
}
