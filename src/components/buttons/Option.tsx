import React, { Dispatch, SetStateAction } from 'react';
import { TFunction } from 'i18next';
import TextToSpeechBtn from './TextToSpeechBtn';
import { Option } from 'types';
import { addEndingPunctuation } from 'utils';
import ALL_CONSTANT from 'constants/constant';
import { getOptionValue } from 'pages/questions/hooks/useQuestionData';

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
  const optionValue = getOptionValue(option);
  const optionClassname = `flex flex-row items-center justify-between rounded-lg ${
    isCorrect
      ? 'bg-lightGreen shadow-sm shadow-green-500'
      : isCorrect === false ? 'bg-lightRed shadow-sm shadow-maroon' : `bg-white-125 shadow-sm shadow-skyBlue ${!disabled ? 'hover:bg-white-150' : ''}`
  }`;

  const textClassname = `gurmukhi font-medium text-md xl:text-2xl ${
    isCorrect === false ? 'text-brightRed' : 'text-darkBlue'
  }`;

  if (!optionValue) {
    return null;
  } else {
    return (
      <div className={optionClassname}>
        <button className={'h-full w-full p-3 xl:ps-6'}
          onClick={() => {
            selector(option);
            setOptionSelected(true);
          }}
          disabled={disabled}
        >
          <span className={textClassname}>
            {
              addEndingPunctuation(optionValue, text('GURMUKHI'))
            }
          </span>
        </button>
        <TextToSpeechBtn
          text={optionValue}
          type={ALL_CONSTANT.OPTION}
          id={option.id}
          audioURL={option.audioURL}
          classname='h-full title'
          divider={text('DIVIDER')}
          rounded={false}
        />
      </div>
    );
  }
}
