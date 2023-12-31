import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import BackBtn from 'components/buttons/BackBtn';
import { wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import { highlightWord } from 'utils';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Examples() {
  const { t: text } = useTranslation();
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();
  const { title, description } = metaTags.EXAMPLES;
  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  const hasNoSynonymsOrAntonyms = !currentWord.synonyms?.length && !currentWord.antonyms?.length;
  const nextUrl =
    ROUTES.WORD +
    (hasNoSynonymsOrAntonyms
      ? `${ROUTES.INFORMATION}?id=${wordId}`
      : `${ROUTES.SEMANTICS}?id=${wordId}`);

  const LevelsFooterProps = {
    nextUrl,
    nextText: 'Next',
    absolute: true,
  };

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col h-screen items-center gap-5'>
      <Meta title={title} description={description} />
      <BackBtn navlink={-1} />
      <div className='flex flex-col h-full justify-center items-center gap-5 pb-12 brandon-grotesque'>
        <h1 className='text-4xl gurmukhi text-black'>{currentWord.word}</h1>
        <h2 className='text-2xl italic text-gray-e4'>{currentWord.translation}</h2>
        <img
          className='w-3/5 h-6'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-between gap-5'>
          <span className='tracking-widest'>{text('EXAMPLES').toUpperCase()}</span>
          <div className='flex flex-col items-left text-left justify-evenly p-8 gap-5'>
            {currentWord.sentences?.map((sentence, index) => {
              const highlightedSentence = highlightWord(
                sentence.sentence,
                currentWord.word ?? '',
                'gurmukhi',
              );
              return (
                <div key={index} className='flex flex-col text-xl gap-1'>
                  <span className='text-black-111'>{highlightedSentence}</span>
                  <span className='text-black'>
                    {sentence.translation.endsWith('.') || sentence.sentence.endsWith('?')
                      ? sentence.translation
                      : sentence.translation + '.'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <img
          className='w-3/5 h-6 rotate-180'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
      </div>
      <LevelsFooter {...LevelsFooterProps} />
    </div>
  );
}
