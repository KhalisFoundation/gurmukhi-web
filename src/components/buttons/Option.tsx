import React, { Dispatch, SetStateAction } from 'react';
import { TFunction } from 'i18next';
import TextToSpeechBtn from './TextToSpeechBtn';
import { Option } from 'types';
import { addEndingPunctuation } from 'utils';
import ALL_CONSTANT from 'constants/constant';

interface OptionProps {
  option: Option;
  text: TFunction<'translation', undefined>;
  selector: Dispatch<SetStateAction<Option | null>>;
  setOptionSelected: (value: boolean) => void;
  isCorrect?: boolean | null;
  disabled?: boolean;
}

export default function OptionBtn({
  option,
  text,
  selector,
  setOptionSelected,
  isCorrect,
  disabled,
}: OptionProps) {
  const optionClassname = `flex flex-row items-center justify-between gap-5 rounded-lg p-4 ps-6 ${
    isCorrect
      ? 'bg-lightGreen shadow-sm shadow-green-500'
      : isCorrect === false
        ? 'bg-lightRed shadow-sm shadow-maroon'
        : `bg-white-125 shadow-sm shadow-skyBlue ${
          !disabled ? 'hover:bg-white-150' : ''
        }`
  }`;

  const textClassname = `gurmukhi font-medium text-2xl ${
    isCorrect === false ? 'text-brightRed' : 'text-darkBlue'
  }`;
  return (
    <div
      className={optionClassname}
    >
      <button
        className={'h-full w-full'}
        onClick={() => {
          selector(option);
          setOptionSelected(true);
        }}
        disabled={disabled}
      >
        <span className={textClassname}>
          {option.word
            ? addEndingPunctuation(option.word, text('GURMUKHI'))
            : option.option}
        </span>
      </button>
      <TextToSpeechBtn
        backgroundColor='bg-white-175'
        text={option.word ? option.word : option.option ?? ''}
        type={ALL_CONSTANT.OPTION}
        id={option.id}
      />
    </div>
  );
}
