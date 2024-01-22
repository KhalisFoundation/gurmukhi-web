import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'types';
import { LocalUser } from 'auth/context';
import { DocumentReference } from 'firebase/firestore';
import { Counter } from '../Counter';

type UserData = LocalUser & User & {
  words: Array<{
    wordID: string;
    word: string;
    translation: string;
    progress: number;
    isLearnt: boolean;
    isWordRead: boolean;
    wordRef: DocumentReference;
  }>;
};

function WordsSnippetBox({
  commonStyle,
  user,
  wordsLearnt,
}: {
  commonStyle: string;
  user: UserData;
  wordsLearnt: number;
}) {
  const { t: text } = useTranslation();
  const words = user?.words;
  const [fallenWords, setFallenWords] = useState<number>(0);

  useEffect(() => {
    if (words && fallenWords < words.length) {
      setTimeout(() => {
        setFallenWords((prev) => prev + 1);
      }, 100);
    }
  }, [fallenWords, words]);

  const wordBrick = words?.map((word, index) => {
    const animationDelay = `${index * 0.1}s`; // Adjust the delay as needed

    return (
      <div
        key={word.wordID}
        className={`word-fall-animation ${index % 2 === 0 ? 'even' : 'odd'}`}
        style={{ animationDelay }}
      >
        <div className='bg-white rounded-lg opacity-25 py-1'>
          <div className='flex justify-center items-center h-full'>
            <p className='text-lg text-sky-800'>{word.word}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className={`word-container ${commonStyle}`}>
      <div className='content-overlay'>
        <div className='flex justify-center items-center h-full w-full'>
          <div>
            <p className='font-serif text-sm text-sky-700 mb-4'>{text('WORDS_YOU_LEARNT')}</p>
            <Counter n={wordsLearnt} className={'text-6xl text-sky-800'}/>
          </div>
        </div>
      </div>
      <div className='word-brick-container'>
        {wordBrick}
      </div>
    </div>
  );
}

export default WordsSnippetBox;
