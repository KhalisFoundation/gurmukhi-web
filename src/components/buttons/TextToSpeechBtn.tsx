import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import { generateNarakeetAudio } from 'narakeet-axios';
import Loading from 'components/loading';

interface TextToSpeechBtnProps {
  text: string;
  type: string;
  audioURL?: string;
  id?: string;
  backgroundColor?: string;
  setLoading?: Dispatch<boolean>,
}

const TextToSpeechBtn: FC<TextToSpeechBtnProps> = ({ text = 'word', type, audioURL, id, backgroundColor, setLoading }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>(audioURL || '');
  const audioRef = useRef<HTMLAudioElement>(null);

  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  const betterText = text.replace(/___/g, 'ਡੈਸ਼').replace(/[_]/g, ',');

  useEffect(() => {
    const generateAudio = async () => {
      // let justSetAudioUrl = false;
      try {
        let audioNotWorking = false;
        if (audioUrl) {
          const decodedAudioUrl = decodeURIComponent(audioUrl);
          const audioText = decodedAudioUrl.split('/')[5].split('.mp3')[0];
          const currentText = betterText.replace(/[\s ]/g, '_');

          if (audioText !== currentText) {
            audioNotWorking = true;
            setAudioUrl('');
          } else {
            const audio = new Audio(audioUrl);
            audio.oncanplay = () => {
              audioNotWorking = false;
            };
            audio.onerror = () => {
              audioNotWorking = true;
            };
          }
        }

        if (!audioUrl || audioNotWorking) {
          setLoading?.(true);
          setIsLoading(true);
          const audioContent = await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
          console.log('Narakeet Audio Content: ', audioContent);
          // justSetAudioUrl = true;
        }
      } catch (error) {
        console.error('Error generating audio:', error);
      } finally {
        setIsLoading(false);
        setLoading?.(false);
        // Code to auto play audio
        // if (justSetAudioUrl || !isPlaying) {
        //   audioRef.current?.play();
        // }
      }
    };
    generateAudio();
  }, [text]);

  const onBtnClick = async () => {
    let justSetAudioUrl = false;
    try {
      if (!audioUrl) {
        setIsLoading(true);
        const audioContent = await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
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
        <Loading size={'5'} />
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
