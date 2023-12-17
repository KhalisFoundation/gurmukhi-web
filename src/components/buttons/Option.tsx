import React from 'react';
import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';
import TextToSpeechBtn from './TextToSpeechBtn';
import { Option } from 'types';
import { addEndingPunctuation } from 'utils/words';
import { ROUTES } from 'constants/routes';

interface OptionProps {
  option: Option;
  text: TFunction<'translation', undefined>;
  selector: React.Dispatch<React.SetStateAction<Option | null>>;
  word_id?: number | string;
  isCorrect?: boolean | null;
  disabled?: boolean;
}

export default function OptionBtn({ option, text, selector, word_id, isCorrect, disabled }: OptionProps) {
  let optionClassname = 'flex flex-row items-center justify-between gap-5 rounded-lg p-4 ps-6';
  if (isCorrect) {
    optionClassname += ' bg-lightGreen shadow-sm shadow-green-500';
  } else if (isCorrect === false) {
    optionClassname += ' bg-lightRed shadow-sm shadow-maroon';
  } else {
    optionClassname += ` bg-white-125 shadow-sm shadow-skyBlue ${!disabled ? 'hover:bg-white-150' : ''}`;
  }

  const textClassname = `gurmukhi font-medium text-2xl ${isCorrect === false ? 'text-brightRed' : 'text-darkBlue'}`;
  return (
    <button className={optionClassname} onClick={() => selector(option)} disabled={disabled}>
      <span className={textClassname}>{addEndingPunctuation(option.word, text('GURMUKHI'))}</span>
      {isCorrect === false ? (
        <Link to={`${ROUTES.WORD + ROUTES.INFORMATION}?id=${word_id}`} className={'text-sm text-maroon rounded-full p-4 tracking-widest uppercase brandon-grotesque'}>{text('KNOW_MORE')}</Link>
      ) : (
        <TextToSpeechBtn />
      )}
    </button>
  );
}
