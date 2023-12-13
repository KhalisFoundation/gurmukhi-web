import React from 'react';
import TextToSpeechBtn from './TextToSpeechBtn';
import { Option } from 'types';

interface OptionProps {
  option: Option;
  backgroundColor?: string;
  isCorrect?: boolean;
}

export default function OptionBtn({ option, backgroundColor, isCorrect }: OptionProps) {
  const [isSelected, setIsSelected] = React.useState<boolean | null>(null); // null means not selected yet
  let optionClassname = 'flex flex-row items-center justify-between gap-5 rounded-lg p-4';
  if (isSelected) {
    optionClassname += ' bg-green-500';
  } else if (isSelected === false) {
    optionClassname += ' bg-red-500';
  } else {
    optionClassname += ` bg-${backgroundColor}`;
  }
  return (
    <div className={optionClassname} onClick={() => {
      if (isSelected) {
        setIsSelected(false);
      } else {
        setIsSelected(true);
      }
    }}>
      <span className={'text-black-111'}>{option.word}</span>
      <TextToSpeechBtn backgroundColor='transparent' />
    </div>
  );
}
