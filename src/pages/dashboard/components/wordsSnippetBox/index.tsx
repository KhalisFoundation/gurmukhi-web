import React from 'react';
import { useTranslation } from 'react-i18next';
import { wordData } from 'constants/wordsData';

function WordsSnippetBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  return (
    <div className={commonStyle}>
      <div className="flex justify-center items-center h-full">
        <div>
          <p className="font-serif text-sm text-sky-700 mb-4">{text('WORDS_YOU_LEARNT')}</p>
          <p className="text-6xl text-sky-800">{wordData.length * 18}</p>
        </div>
      </div>
    </div>
  );
}
export default WordsSnippetBox;
