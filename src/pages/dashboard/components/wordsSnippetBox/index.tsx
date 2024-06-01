import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Counter } from '../Counter';
import { useUserAuth } from 'auth';
import { getLearntWords } from 'database/shabadavalidb';
import { WordShabadavaliDB } from 'types/shabadavalidb';
import CONSTANTS from 'constants/constant';

function WordsSnippetBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  const [wordsLearnt, setWordsLearnt] = useState<WordShabadavaliDB[]>();
  const { user } = useUserAuth();
  const [fallenWords, setFallenWords] = useState<number>(0);
  useEffect(() => {
    const fetchWords = async () => {
      const words = await getLearntWords(user.uid);
      if (words) {
        setWordsLearnt(words);
      }
    };
    if (user.uid) {
      fetchWords();
    }
  }, [user.uid]);

  useEffect(() => {
    if (wordsLearnt && fallenWords < wordsLearnt.length) {
      setTimeout(() => {
        setFallenWords((prev) => prev + CONSTANTS.DEFAULT_ONE);
      }, CONSTANTS.FALLEN_SPEED);
    }
  }, [fallenWords, wordsLearnt]);

  const wordBrick = wordsLearnt?.map((word, index) => {
    const animationDelay = `${index * CONSTANTS.ANIMATION_DELAY}s`; // Adjust the delay as needed

    return (
      <div
        key={word.id}
        className={`md:block word-fall-animation hidden ${
          index % CONSTANTS.REMINDER_NUMBER === 0 ? 'even' : 'odd'
        }`}
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
    <div className={`word-container ${commonStyle} p-4 overflow-hidden`}>
      <div className='flex justify-center items-center h-full w-full'>
        {wordsLearnt && wordsLearnt?.length > 0 && (
          <div className='word-brick-container'>{wordBrick}</div>
        )}
        <div className={`${wordsLearnt && wordsLearnt?.length > 0 ? 'content-overlay' : ''} flex`}>
          <div className=' m-auto'>
            <p className='font-serif text-sm text-sky-700 mb-4'>{text('WORDS_YOU_LEARNT')}</p>
            <Counter n={wordsLearnt?.length ?? 0} className={'text-3xl md:text-6xl text-sky-800'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordsSnippetBox;
