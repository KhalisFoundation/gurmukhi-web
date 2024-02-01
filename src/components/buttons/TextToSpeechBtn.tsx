import React from 'react';
import * as Anvaad from 'anvaad-js';
import { useSpeechSynthesis } from 'react-speech-kit';
import { generateNarakeetAudio } from 'narakeet-axios';

interface TextToSpeechBtnProps {
  text?: string;
  word_id?: string;
  backgroundColor?: string;
}

const fixSihari = (word: string) => {
  let newWord = '';
  word.split('').map((letter, index) => {
    if (index > 0) {
      if (newWord[index - 1] === 'i' && index - 1 !== 0 && newWord[index - 2] !== ' ') {
        newWord = newWord.slice(0, index - 1) + letter + 'y';
      } else {
        newWord += letter;
      }
    } else {
      newWord += letter;
    }
  });
  return newWord;
};

export default function TextToSpeechBtn({ text = 'word', backgroundColor }: TextToSpeechBtnProps) {
  // const [isLoading, setLoading] = useState(false);
  const { speak } = useSpeechSynthesis();
  const voices = window.speechSynthesis.getVoices();
  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  const translit = Anvaad.unicode(text, true);
  const sihariFixed = fixSihari(translit);
  const devnagri = Anvaad.translit(sihariFixed, 'devnagri');
  // remove any punctuation marks from translit
  const punctuationless = devnagri.replace(/[\ƒƒ\u0192]/g, 'नूँ').replace(/___/g, 'डैश').replace(/[_]/g, ',');
  const onBtnClick = async () => {
    const audioContent = generateNarakeetAudio(text);
    console.log('Narakeet Audio Content: ', audioContent);
    const punjabiVoice = voices.find((voice) => voice.lang.includes('pa-IN'));
    console.log('Punjabi Voice: ', punjabiVoice);
    const customVoice = voices.find((voice) => voice.lang === 'hi-IN');
    console.log('Translit: ', translit);
    console.log('Sihari Fixed: ', sihariFixed);
    console.log('Devnagri: ', devnagri);
    console.log('Punctuationless: ', punctuationless);
    speak({ text: punctuationless, voice: customVoice });
    // const data = await getAudio(text);
    // console.log('Audio Data: ', data);
    // const uploadedURL = await generateAndUploadAudio(text, word_id, setLoading);
    // console.log('Uploaded URL: ', uploadedURL);
  };
  return (
    <button className={ttsClassname} onClick={onBtnClick}>
      {/* {isLoading ? (
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
        :  */}
      <img src={'/icons/speaker.svg'} alt='Text to Speech' width={24} height={24} />
      {/* } */}
    </button>
  );
}
