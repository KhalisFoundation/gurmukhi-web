import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { getWordById } from 'database/default';
import { highlightWord } from 'utils';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { WordType } from 'types';
import { useAppSelector } from 'store/hooks';
import Loading from 'components/loading';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import CONSTANTS from 'constants/constant';

export default function Examples() {
  const { t: text } = useTranslation();
  const [wordID, setWordID] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<WordType | null>(null);
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const [isLoading, toggleLoading] = useState<boolean | null>(null);
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
      toggleLoading(true);
      if (!wordID) {
        toggleLoading(false);
        return;
      }
      const words = await getWordById(wordID, true);
      if (words !== null) {
        setCurrentWord(words);
      }
      toggleLoading(false);
    };
    if (location.state?.data) {
      setCurrentWord(location.state.data);
    } else {
      fetchData();
    }
  }, [wordID]);

  const LevelsFooterProps = {
    operation: ALL_CONSTANT.NEXT,
    nextText: 'Next',
    absolute: true,
    currentGamePosition: currentGamePosition + CONSTANTS.DEFAULT_ONE,
    currentLevel: currentLevel,
    isDisabled: false,
    isLoading: isLoading,
  };

  if (!currentWord) {
    // Handle case when word is not found
    return <Loading />;
  }

  return (
    <div className='flex flex-col justify-center items-center gap-5 w-full h-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col h-full justify-center items-center gap-1 brandon-grotesque w-5/6'>
        <h1 className='text-xl md:text-4xl gurmukhi text-black'>{currentWord.word}</h1>
        <h2 className='text-sm md:text-2xl italic text-gray-e4'>{currentWord.translation}</h2>
        <img
          className='w-3/5 h-6'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-between md:gap-5 gap-2'>
          <span className='text-sm tracking-widest'>{text('EXAMPLES').toUpperCase()}</span>
          <div className='flex flex-col items-left text-left justify-evenly md:p-8 gap-5'>
            {currentWord.sentences?.map((sentence, index) => {
              const highlightedSentence = highlightWord(
                sentence.sentence,
                currentWord.word ?? '',
                'gurmukhi',
              );
              return (
                <div key={index} className='flex flex-col text-sm lg:text-xl '>
                  <span className='flex text-black-111 items-center gap-2'>
                    {highlightedSentence}
                    {sentence && sentence.sentence && (
                      <TextToSpeechBtn
                        backgroundColor='bg-white-150'
                        text={sentence.sentence}
                        type={ALL_CONSTANT.SENTENCE}
                        id={currentWord.id}
                        size={20}
                      />
                    )}
                  </span>
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
