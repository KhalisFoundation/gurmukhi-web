import React from 'react';
import { wordData } from 'constants/wordsData';
import { useTranslation } from 'react-i18next';

function WordBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  return (
    <div className={commonStyle}>
      <div className="flex justify-center items-center h-full">
        <div>
          <img className="mx-auto my-2" src="/images/star.png" alt="Star" />
          <p className="font-serif text-sm text-sky-700 mb-4">{text('RANDOM_WORD_TITLE')}</p>
          <p className="text-4xl text-sky-900 mb-7 gurmukhi">{wordData[1].word}</p>
          <p className="font-serif text-sm text-sky-700 mb-2">{text('EXPLORE_WORD')}</p>
          <img className="mx-auto my-0" src="/images/line.png" alt="Line" />
        </div>
      </div>
    </div>
  );
}
export default WordBox;
