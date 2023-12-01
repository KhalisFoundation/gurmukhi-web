import React from 'react';
import { useLocation } from 'react-router-dom';
import CONSTANTS from '@/constants';
import TextToSpeechBtn from '@/components/buttons/TextToSpeechBtn';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';
import { wordData } from '@/constants/wordsData';
import { ROUTES } from '@/constants/routes';

export default function Defintion() {
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{CONSTANTS.WORD_NOT_FOUND}</div>;
  }

  return (
    <div className="flex flex-col static h-screen items-center justify-around gap-5">
      <BackBtn />
      <div className='flex flex-col h-3/4 justify-center items-center gap-5'>
        <img className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        <div className="flex flex-row items-center justify-between gap-5">
          <img
            alt='word-image'
            height={296}
            width={524}
            src={currentWord.image ? currentWord.image : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'}
            className='object-cover rounded-xl'
          />
          <div className="flex flex-col h-[296px] items-left justify-evenly p-8">
            <div className="flex flex-row items-center justify-between gap-5">
              <div className="flex flex-col">
                <h1 className={'text-5xl gurmukhi text-black'}>{currentWord.word}</h1>
                <h2 className="text-2xl brandon-grotesque italic text-gray-4e4">{currentWord.translation}</h2>
              </div>
              <TextToSpeechBtn />
            </div>
            <div className="flex flex-col text-lg">
              <span className={'text-black-111'}>{currentWord.meaningEnglish}</span>
              <span className={'text-black'}>{currentWord.meaning}</span>
            </div>
          </div>
        </div>
        <img className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.EXAMPLES}?id=${wordId}`} nextText='Next'/>
    </div>
  );
}

Defintion.propTypes = {};

