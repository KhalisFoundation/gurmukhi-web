import React, { useEffect, useState } from 'react';
import { WordData } from 'constants/wordsData';
import { useTranslation } from 'react-i18next';
import { getRandomWord } from 'utils';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

function WordBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  const [randomWord, setRandomWord] = useState<WordData>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Asynchronous logic here
      const newWord = await getRandomWord();
      setRandomWord(newWord);
    };

    fetchData();
  }, []);

  return (
    <div className={commonStyle}>
      <div className="flex justify-center items-center h-full">
        <div>
          <img className="mx-auto my-2" src="/images/star.png" alt="Star" />
          <p className="font-serif text-sm text-sky-700 mb-4">{text('RANDOM_WORD_TITLE')}</p>
          <p className="text-4xl text-sky-900 mb-7 gurmukhi">{randomWord.word}</p>
          <button className="font-serif text-sm text-sky-700 mb-2"
            onClick={() => {
              // navigate to information with random word as part of state
              navigate(`${ROUTES.WORD + ROUTES.INFORMATION}`, { state: { word: randomWord } });
            }}
          >{text('EXPLORE_WORD')}</button>
          <img className="mx-auto my-0" src="/images/line.png" alt="Line" />
        </div>
      </div>
    </div>
  );
}
export default WordBox;
