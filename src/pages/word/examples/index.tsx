import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { getWordById } from 'database/default';
import { highlightWord } from 'utils';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { WordData } from 'constants/wordsData';
import { useAppSelector } from 'store/hooks';

export default function Examples() {
  const { t: text } = useTranslation();
  const [wordID, setWordID] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const currentGamePosition = useAppSelector(
    (state) => state.currentGamePosition,
  );
  const currentLevel = useAppSelector((state) => state.currentLevel);
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();
  const { title, description } = metaTags.EXAMPLES;
  // Extract the "id" parameter from the search string in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!wordID) {
        return;
      }
      const words = await getWordById(wordID, true);
      if (words !== null) {
        setCurrentWord(words);
      }
    };
    const data = location.state.data;
    if (data) {
      setCurrentWord(data);
    } else {
      fetchData();
    }
  }, [wordID]);

  const LevelsFooterProps = {
    operation: ALL_CONSTANT.NEXT,
    nextText: 'Next',
    absolute: true,
    currentGamePosition: currentGamePosition + 1,
    currentLevel: currentLevel,
    isDisabled: false,
  };

  if (!currentWord) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col items-center gap-5 w-full h-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col h-full justify-center items-center gap-5 brandon-grotesque'>
        <h1 className='text-4xl gurmukhi text-black'>{currentWord.word}</h1>
        <h2 className='text-2xl italic text-gray-e4'>
          {currentWord.translation}
        </h2>
        <img
          className='w-3/5 h-6'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-between gap-5'>
          <span className='tracking-widest'>
            {text('EXAMPLES').toUpperCase()}
          </span>
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
                    {sentence.translation.endsWith('.') ||
                    sentence.sentence.endsWith('?')
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
