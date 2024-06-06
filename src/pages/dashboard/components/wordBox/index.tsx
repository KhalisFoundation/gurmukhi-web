import React from 'react';
import { WordType } from 'types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

function WordBox({
  commonStyle,
  randomWord,
}: {
  commonStyle: string;
  randomWord: WordType | null;
}) {
  const { t: text } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={commonStyle}>
      <div className='flex justify-center items-center h-full'>
        <div className='my-2'>
          <img className='mx-auto my-2' src='/images/star.png' alt='Star' />
          <p className='font-serif text-xs md:text-sm text-sky-700 mb-4'>
            {text('RANDOM_WORD_TITLE')}
          </p>
          <p className='text-xl md:text-4xl text-sky-900 md:mb-7 gurmukhi'>
            {randomWord ? randomWord.word : ''}
          </p>
          {randomWord && (
            <button
              className='font-serif text-xs md:text-sm text-sky-700 mb-2'
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
