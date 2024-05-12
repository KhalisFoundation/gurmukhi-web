import React, { useEffect, useState } from 'react';
import { User, WordType } from 'types';
import { useTranslation } from 'react-i18next';
import { getRandomWord } from 'database/default';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { useUserAuth } from 'auth';
import { getUserData } from 'database/shabadavalidb';

function WordBox({ commonStyle }: { commonStyle: string }) {
  const { t: text } = useTranslation();
  const user = useUserAuth().user as User;
  const [randomWord, setRandomWord] = useState<WordType>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData(user.uid);
      const newWord = await getRandomWord(user.uid, userData?.wordIds || [], false);
      if (newWord) {
        setRandomWord(newWord);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div className='my-2'>
          <img className='mx-auto my-2' src='/images/star.png' alt='Star' />
          <p className='font-serif text-sm text-sky-700 mb-4'>{text('RANDOM_WORD_TITLE')}</p>
          <p className='text-4xl text-sky-900 mb-7 gurmukhi'>{randomWord ? randomWord.word : ''}</p>
          {randomWord && (
            <button
              className='font-serif text-sm text-sky-700 mb-2'
              onClick={() => {
                // navigate to information with random word as part of state
                navigate(`${ROUTES.WORD + ROUTES.INFORMATION}?id=${randomWord.id}`, {
                  state: { data: randomWord, isRandom: true },
                });
              }}
            >
              {text('EXPLORE_WORD')}
            </button>
          )}
          <img className='mx-auto my-0' src='/images/line.png' alt='Line' />
        </div>
      </div>
    </div>
  );
}
export default WordBox;
