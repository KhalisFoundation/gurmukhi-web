import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import BackBtn from 'components/buttons/BackBtn';
import { wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import { convertToTitleCase, getWordById, highlightWord } from 'utils';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { MiniWord, SentenceType } from 'types';

export default function Information() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.INFORMATION;
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id') ?? '';

  // fetch word from state using wordId
  const currentWord = location.state?.word ?? getWordById(wordId, true);

  const renderFooter = (word_id: number) => {
    if (word_id <= wordData.length - 1 && wordId !== '') {
      if (currentWord.questions && currentWord.questions.length > 0) {
        return <LevelsFooter nextUrl={`${ROUTES.QUESTION}?id=${word_id}&qid=0`} nextText='Next' />;
      } else {
        return (
          <LevelsFooter
            nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=${word_id + 1}`}
            nextText='Next'
          />
        );
      }
    } else {
      return (
        <LevelsFooter nextUrl={ROUTES.DASHBOARD} nextText='Back to Dashboard' />
      );
    }
  };

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col items-center gap-5'>
      <Meta title={title} description={description} />
      <BackBtn navlink={-1} />
      <div className='flex flex-col h-3/4 justify-center items-center gap-5'>
        <img
          className='w-3/5 h-6'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-row items-center justify-between gap-5'>
          <div className='flex flex-col items-left justify-evenly w-1/2 p-8 gap-5'>
            <div>
              <div className='flex flex-row items-center justify-between w-4/5'>
                <div className='flex flex-col gap-5'>
                  <h1 className={'text-5xl gurmukhi text-black'}>{currentWord.word}</h1>
                  <h2 className='text-2xl brandon-grotesque italic text-gray-4e4'>
                    {currentWord.translation}
                  </h2>
                </div>
                <TextToSpeechBtn />
              </div>
              <div className='flex flex-col text-lg'>
                <span className={'text-black-111'}>{currentWord.meaningEnglish}</span>
                <span className={'text-black'}>{currentWord.meaning}</span>
              </div>
            </div>
            <img
              alt='word-image'
              width={524}
              src={
                currentWord.image
                  ? currentWord.image
                  : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
              }
              className='object-cover rounded-xl'
            />
          </div>
          <div className='flex flex-col items-left justify-evenly w-3/4'>
            <div className='flex flex-col items-left text-left justify-between gap-6'>
              <span className='tracking-widest'>{text('EXAMPLES').toUpperCase()}</span>
              {currentWord.sentences && currentWord.sentences.map((sentence: SentenceType, index: number) => {
                const highlightedSentence = highlightWord(
                  sentence.sentence,
                  currentWord.word ?? '',
                  'gurmukhi',
                );
                return (
                  <div key={index} className='flex flex-col text-xl'>
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
            <div className='flex items-center justify-around my-10 gap-5 w-full'>
              <div
                className={`w-2/5 h-64 p-5 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg ${
                  (currentWord.synonyms.length === 0) ? 'hidden' : ''
                }`}
              >
                <h2 className='text-black tracking-widest ms-2'>
                  {text('SYNONYMS').toUpperCase()}
                </h2>
                <div className='grid grid-cols-1 m-2 gap-2 h-fit w-full'>
                  {currentWord.synonyms.map((word: MiniWord) => {
                    return (
                      <div
                        key={word.id}
                        className={
                          'flex h-min w-max p-4 text-black text-sm rounded-lg z-10 bg-white'
                        }
                      >
                        {word.word} ({convertToTitleCase(word.translation ?? '')})
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={`w-2/5 h-64 p-5 cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg ${
                  (currentWord.antonyms.length === 0) ? 'hidden' : ''
                }`}
              >
                <h2 className='text-black tracking-widest ms-2'>
                  {text('ANTONYMS').toUpperCase()}
                </h2>
                <div className='grid grid-cols-1 m-2 gap-2 h-fit w-full'>
                  {currentWord.antonyms.map((word: MiniWord) => {
                    return (
                      <div
                        key={word.id}
                        className={
                          'flex h-min w-max p-4 text-black text-sm rounded-lg z-10 bg-white'
                        }
                      >
                        {word.word} ({convertToTitleCase(word.translation ?? '')})
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
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
      {renderFooter(Number(wordId))}
    </div>
  );
}

Information.propTypes = {};
