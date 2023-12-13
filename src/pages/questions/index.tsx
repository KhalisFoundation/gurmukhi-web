import { wordData } from 'constants/wordsData';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function Questions() {
  const { t: text } = useTranslation();
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.questions) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }
  return (
    <section className="flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute">
      {text('QUESTIONS')}
    </section>
  );
}
