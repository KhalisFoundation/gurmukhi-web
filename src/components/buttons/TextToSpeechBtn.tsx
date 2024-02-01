import React, { FC, useEffect, useRef, useState } from 'react';
import { generateNarakeetAudio } from 'narakeet-axios';

interface TextToSpeechBtnProps {
  text?: string;
  word_id?: string;
  backgroundColor?: string;
}

const TextToSpeechBtn: FC<TextToSpeechBtnProps> = ({ text = 'word', backgroundColor }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  const betterText = text.replace(/___/g, 'ਡੈਸ਼').replace(/[_]/g, ',');

  const onBtnClick = async () => {
    let justSetAudioUrl = false;
    try {
      if (!audioUrl) {
        setIsLoading(true);
        const audioContent = await generateNarakeetAudio(betterText, setAudioUrl);
        console.log('Narakeet Audio Content: ', audioContent);
        justSetAudioUrl = true;
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsLoading(false);
      if (justSetAudioUrl || !isPlaying) {
        audioRef.current?.play();
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplaying = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
  }, [audioRef.current]);

  return (
    <button className={ttsClassname} onClick={onBtnClick} disabled={isLoading}>
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
      ) : (
        <>
          <img src={'/icons/speaker.svg'} alt='Play' width={24} height={24} />
          {audioUrl && <audio ref={audioRef} src={audioUrl} />}
        </>
      )}
    </button>
  );
};

export default TextToSpeechBtn;
