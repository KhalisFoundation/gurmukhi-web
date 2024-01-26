import React, { useState } from 'react';
import * as Anvaad from 'anvaad-js';
import { useSpeechSynthesis } from 'react-speech-kit';
import { generateAndUploadAudio, getAudio } from 'narakeet-axios';

interface TextToSpeechBtnProps {
  text?: string;
  word_id?: string;
  backgroundColor?: string;
}

export default function TextToSpeechBtn({ text = 'word', word_id = 'word5', backgroundColor }: TextToSpeechBtnProps) {
  const [isLoading, setLoading] = useState(false);
  const { speak } = useSpeechSynthesis();
  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  const onBtnClick = async () => {
    const translit = Anvaad.translit(Anvaad.unicode(text, true));
    console.log('Text: ', text,'Transliteration: ', translit);
    speak({ text: translit });
    // const data = await getAudio(text);
    // console.log('Audio Data: ', data);
    // const uploadedURL = await generateAndUploadAudio(text, word_id, setLoading);
    // console.log('Uploaded URL: ', uploadedURL);
  };
  return (
    <button className={ttsClassname} onClick={onBtnClick}>
      {isLoading ? (
        <svg 
          className='animate-spin h-5 w-5 m-auto'
          viewBox='0 0 24 24'
          style={{
            display: 'inline',
            marginInlineEnd: '0.5rem',
          }}
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='#1F4860'
            strokeWidth='2'
            fill='none'
            strokeDasharray='31.4 31.4'
          />
        </svg>
      )
        : <img src={'/icons/speaker.svg'} alt='Text to Speech' width={24} height={24} />
      }
    </button>
  );
}
