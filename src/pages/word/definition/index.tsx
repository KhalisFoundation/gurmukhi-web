import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { WordType } from 'types';
import metaTags from 'constants/meta';
import Meta from 'components/meta';
import { getWordById } from 'database/default';
import ALL_CONSTANT from 'constants/constant';
import { useAppSelector } from 'store/hooks';
import Loading from 'components/loading';
import CONSTANTS from 'constants/constant';

export default function Defintion() {
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();
  const { title, description } = metaTags.DEFINITION;
  const [wordID, setWordID] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<WordType | null>(null);
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);

  // Extract the "id" parameter from the search string in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
  }, [location.search]);

  // fetch word from state using wordId
  useEffect(() => {
    const fetchData = async () => {
      if (!wordID) {
        return;
      }
      const words = await getWordById(wordID);
      if (words !== null) {
        setCurrentWord(words);
      }
    };

    if (location.state?.data) {
      setCurrentWord(location.state.data);
    } else {
      fetchData();
    }
  }, [wordID]);

  if (!currentWord) {
    // Handle case when word is not found
    return <Loading />;
  }

  return (
    <div className='flex flex-col justify-end h-full w-full'>
      <Meta title={title} description={description} />
      <div className='flex flex-col h-3/4 justify-center items-center gap-5 w-5/6 m-auto'>
        <img
          className=' w-5/6 h-6 md:w-3/5'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-col lg:flex-row items-center justify-between gap-5'>
          <img
            alt='word-image'
            height={296}
            width={524}
            src={
              currentWord.images && currentWord.images?.length > 0
                ? currentWord.images[0]
                : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
            }
            className='object-cover rounded-xl'
          />
          <div className='flex flex-col lg:h-[296px] items-left justify-center lg:justify-evenly '>
            <div className='flex flex-row items-center justify-between gap-5'>
              <div className='flex flex-col'>
                <h1 className={'text-5xl gurmukhi text-black'}>{currentWord.word}</h1>
                <h2 className='text-2xl brandon-grotesque italic text-gray-4e4'>
                  {currentWord.translation}
                </h2>
              </div>
              {currentWord.word && (
                <TextToSpeechBtn
                  backgroundColor='bg-white-150'
                  text={currentWord.word}
                  type={ALL_CONSTANT.WORD}
                  id={currentWord.id}
                  audioURL={currentWord.audioURL}
                />
              )}
            </div>
            <div className='flex flex-col text-lg'>
              <span className={'text-black'}>{currentWord.meaning_punjabi}</span>
              <span className={'text-black-111'}>{currentWord.meaning_english}</span>
            </div>
          </div>
        </div>
        <img
          className='w-5/6 h-6 rotate-180 md:w-3/5'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
      </div>
      <LevelsFooter
        nextText='Next'
        operation={ALL_CONSTANT.NEXT}
        currentLevel={currentLevel}
        currentGamePosition={currentGamePosition + CONSTANTS.DEFAULT_ONE}
        isDisabled={false}
      />
    </div>
  );
}

Defintion.propTypes = {};
