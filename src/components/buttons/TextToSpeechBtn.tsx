import React from 'react';
import { Link } from 'react-router-dom';

interface TextToSpeechBtnProps {
  backgroundColor?: string;
}

export default function TextToSpeechBtn({ backgroundColor }: TextToSpeechBtnProps) {
  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  return (
    <Link to='' className={ttsClassname}>
      <img src={'/icons/speaker.svg'} alt='Text to Speech' width={24} height={24} />
    </Link>
  );
}
