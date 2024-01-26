import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from 'auth';
import { getLearntWordsCount } from 'database/shabadavalidb';

function WordsSnippetBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  const [wordsLearnt, setWordsLearnt] = useState(0);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getLearntWordsCount(user.uid);
      if (count) {
        setWordsLearnt(count);
      }
    };
    if (user.uid) {
      fetchCount();
    }
  }, [user.uid]);
  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div>
          <p className='font-serif text-sm text-sky-700 mb-4'>
            {text('WORDS_YOU_LEARNT')}
          </p>
          <p className='text-6xl text-sky-800'>{wordsLearnt}</p>
        </div>
      </div>
    </div>
  );
}
export default WordsSnippetBox;
