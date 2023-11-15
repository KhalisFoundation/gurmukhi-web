"use client"

import React from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import TextToSpeechBtn from '@/components/buttons/TextToSpeechBtn';

interface WordData {
  [key: number]: {
    word?: string;
    translation?: string;
    meaning?: string;
    meaningEnglish?: string;
    image?: string;
  };
}

const wordData: WordData = {
  1: {
    word: 'ਉਸਾਰੀ',
    translation: 'to build',
    meaning: 'ਕਿਸੇ ਚੀਜ਼ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਉਸ ਨੂੰ ਬਨਾਉਣਾ',
    meaningEnglish: 'To "ਉਸਾਰ" something means to build or construct it',
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77',
  },
  2: {
    word: 'ਪ੍ਰਭੂ',
    translation: 'God',
    meaning: 'ਪ੍ਰਭੂ ਦਾ ਮਤਲਬ ਹੈ ਰੱਬ',
    meaningEnglish: 'God',
  }
}

export default function Defintion() {
  // get the word id from the url
  // e.g. /word/definition/1
  const wordId = useSearchParams().get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>Word not found</div>
  }

  return (
    <div className="flex flex-row items-center justify-between gap-5">
      <Image
        alt='word-image'
        height={296}
        width={524}
        src={currentWord.image? currentWord.image : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'}
        className='object-cover rounded-xl'
      />
      <div className="flex flex-col h-[296px] items-left justify-evenly p-8">
        <div className="flex flex-row items-center justify-between gap-5">
          <div className="flex flex-col">
            <h1 className={`text-5xl gurmukhi text-[#333]`}>{currentWord.word}</h1>
            <h2 className="text-2xl brandon-grotesque italic text-[#4e4e4e]">{currentWord.translation}</h2>
          </div>
          <TextToSpeechBtn />
        </div>
        <div className="flex flex-col text-lg">
          <span className={`text-[#111]`}>{currentWord.meaningEnglish}</span>
          <span className={`text-[#333]`}>{currentWord.meaning}</span>
        </div>
      </div>
    </div>
  )
}

Defintion.propTypes = {}

