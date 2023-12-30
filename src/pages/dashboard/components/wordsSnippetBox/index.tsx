import React from 'react';
import { useTranslation } from 'react-i18next';

function WordsSnippetBox({
  commonStyle,
  wordsLearnt,
}: {
  commonStyle: string;
  wordsLearnt: number;
}) {
  const { t: text } = useTranslation();
  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div>
          <p className='font-serif text-sm text-sky-700 mb-4'>{text('WORDS_YOU_LEARNT')}</p>
          <p className='text-6xl text-sky-800'>{wordsLearnt}</p>
        </div>
      </div>
    </div>
  );
}
export default WordsSnippetBox;
