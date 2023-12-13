import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';

export default function MultipleChoiceQuestionPage() {
  const { t: text } = useTranslation();
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');
  const questionId = Number(searchParams.get('qid')) ?? 0;

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.questions) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div>
      <div className='flex flex-col h-3/4 justify-center items-center gap-5'>
        <img className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        <MultipleChoiceQuestion question={currentWord.questions[questionId]} />
        <img className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      { Number(wordId) >= wordData.length - 1 ?
        <LevelsFooter nextUrl={ROUTES.DASHBOARD} nextText='Back to Dashboard' absolute={true}/>
        : <LevelsFooter nextUrl={`${ROUTES.QUESTION}?id=${(Number(wordId) ?? 0)}&qid=${(Number(questionId) ?? 0) + 1}`} nextText='Next'/>
      }
    </div>
  );
}
