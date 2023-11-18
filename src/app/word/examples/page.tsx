"use client"

import React from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import CONSTANTS from '@/constants';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';

interface WordData {
  [key: number]: {
    word?: string;
    translation?: string;
    meaning?: string;
    meaningEnglish?: string;
    image?: string;
    sentences?: {
      sentence: string;
      sentenceEnglish: string;
    }[];                    
  };
}

const wordData: WordData = {
  1: {
    word: 'ਉਸਾਰੀ',
    translation: 'to build',
    meaning: 'ਕਿਸੇ ਚੀਜ਼ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਉਸ ਨੂੰ ਬਨਾਉਣਾ',
    meaningEnglish: 'To "ਉਸਾਰ" something means to build or construct it',
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77',
    sentences: [
      {
        sentence: 'ਜਦੋ ਗੁਰਜੋਤ ਨੇ ਜਲੰਧਰ ਵਿਚ ਜ਼ਮੀਨ ਖਰੀਦੀ, ਕਿ ਉਸ ਨੂੰ ਇਕ ਨਵੇ ਘਰ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦੀ ਲੋੜ ਪੇਈ?',
        sentenceEnglish: 'When Gurjot bought land in Jalandhar, did he have to construct a new house?',
      },
      {
        sentence: 'ਸਕੂਲ ਦੀ ਨਵੀ ਬਿਲਡਿੰਗ ਦੀ ਉਸਾਰੀ ਨੂੰ ਤਿਨ ਸਾਲ ਲੱਗਣ ਗੇ।',
        sentenceEnglish: 'The school\'s new building\'s construction will take three years',
      },
      {
        sentence: 'ਗੁਰੂ ਰਾਮਦਾਸ ਜੀ ਨੇ ਦਰਬਾਰ ਸਾਹਿਬ ਦੀ ਉਸਾਰੀ ੧੫੮੮ ਵਿੱਚ ਸ਼ੁਰੂ ਕੀਤੀ ਸੀ',
        sentenceEnglish: 'Guru Ram Das Ji began constructing Darbar Sahib in 1588',
      },
    ]
  },
  2: {
    word: 'ਅਭਿਆਸ',
    translation: 'to practice',
    meaning: 'ਕਿਸੇੇ ਚੀਜ਼ ਦਾ ਅਭਿਆਸ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕੇ ਤੁਸੀ ਉਸ ਨੂੰ ਬਾਰ ਬਾਰ ਕਰਦੇ ਹੋ',
    meaningEnglish: 'To do ਅਭਿਆਸ of something means you repeat it again and again',
    sentences: [
      {
        sentence: 'ਮੈਂ ਆਪਣੀ ਪੰਜਾਬੀ ਦਾ ਅਭਿਆਸ ਕਰਨ ਵਾਸਤੇ ਰੋਜ਼ ਪੰਜਾਬੀ ਦੀ ਕਿਤਾਬ ਪੜਦਾ ਹਾਂ।',
        sentenceEnglish: 'To practice my Punjabi, I read a Punjabi book every day.',
      },
      {
        sentence: 'ਮੈਂ ਤੇ ਗੁਰਵਿੰਦਰ ਕੁਸ਼ਤੀ ਦੇ ਅਭਿਆਸ ਲਈ ਹਰ ਰੋਜ਼ ਅਖਾੜੇ ਜਾਂਦੇ ਹਾਂ।',
        sentenceEnglish: 'Gurvinder and I go to the ring every day to practice wrestling.'
      },
      {
        sentence:'ਜਦੋਂ ਸਿਮਰਨ ਨੇ ੧੫ ਦਿਨ ਕੀਰਤਨ ਦਾ ਅਭਿਆਸ ਕੀਤਾ, ਉਸ ਦੇ ਪਿਤਾ ਜੀ ਉਸ ਨੂੰ ਡਿਜ਼ਨੀਲੈਂਡ ਲੈ ਗਏ।',
        sentenceEnglish: 'After Simran practiced kirtan for 15 days, her dad took her to Disneyland.',
      },
    ]
  }
}

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? "।" : ".";
  return sentence.endsWith(punctuation) || sentence.endsWith("?") ? sentence : sentence + punctuation;
};

const highlightWord = (sentence: string, lang: string, word: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className="text-[#333] gurmukhi">
      {splitSentence[0]}
      <span className="text-[#333] font-bold">{word}</span>
      {addEndingPunctuation(splitSentence[1], lang)}
    </span>
  );
}

export default function Examples() {
  // get the word id from the url
  // e.g. /word/examples?id=1
  const wordId = useSearchParams().get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{CONSTANTS.WORD_NOT_FOUND}</div>
  }

  return (
    <div className="flex flex-col static items-center justify-center text-center gap-5 p-12 brandon-grotesque">
      <BackBtn />

      <div className="flex flex-col">
        <h1 className="text-4xl gurmukhi text-[#333]">{currentWord.word}</h1>
        <h2 className="text-2xl italic text-[#4e4e4e]">{currentWord.translation}</h2>
      </div>
      <Image className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      <div className="flex flex-col items-center justify-between gap-5">
        <span className="tracking-widest">{CONSTANTS.EXAMPLES.toUpperCase()}</span>
        <div className="flex flex-col items-left text-left justify-evenly p-8 gap-5 bran">
          {
            currentWord.sentences?.map((sentence, index) => {
              const highlightedSentence = highlightWord(sentence.sentence, 'gurmukhi', currentWord.word ?? "")
              return (
              <div key={index} className="flex flex-col text-xl">
                <span className="text-[#111]">
                  {highlightedSentence}
                </span>
                <span className="text-[#333]">
                  {sentence.sentenceEnglish.endsWith(".") || sentence.sentence.endsWith("?") ? 
                    sentence.sentenceEnglish : sentence.sentenceEnglish + "."}
                </span>
              </div>
            )})
          }
        </div>
      </div>
      <Image className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />

      <LevelsFooter nextUrl={`/word/semantics?id=${wordId}`} nextText='Next'/>
    </div>
  )
}
