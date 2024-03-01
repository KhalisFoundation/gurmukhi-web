import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Counter } from '../Counter';
import { useUserAuth } from 'auth';
import { getLearntWords } from 'database/shabadavalidb';
import { WordShabadavaliDB } from 'types/shabadavalidb';

function WordsSnippetBox({
  commonStyle,
}: {
  commonStyle: string;
}) {
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
        setFallenWords((prev) => prev + 1);
      }, 100);
    }
  }, [fallenWords, wordsLearnt]);

  const wordBrick = wordsLearnt?.map((word, index) => {
    const animationDelay = `${index * 0.1}s`; // Adjust the delay as needed

    return (
      <div
        key={word.id}
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
    <div className={`word-container ${commonStyle} p-4 overflow-hidden`}>
      <div className='flex justify-center items-center h-full w-full'>
        <div className='word-brick-container'>{wordBrick}</div>
        <div className='content-overlay flex'>
          <div className=' m-auto'>
            <p className='font-serif text-sm text-sky-700 mb-4'>{text('WORDS_YOU_LEARNT')}</p>
            <Counter n={wordsLearnt?.length ?? 0} className={'text-6xl text-sky-800'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordsSnippetBox;
