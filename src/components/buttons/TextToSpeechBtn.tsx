import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import Loading from 'components/loading';
import CONSTANTS from 'constants/constant';
import { generateNarakeetAudio } from 'narakeet';

interface TextToSpeechBtnProps {
  text: string;
  type: string;
  audioURL?: string;
  id?: string;
  backgroundColor?: string;
  setLoading?: Dispatch<boolean>;
}

const TextToSpeechBtn: FC<TextToSpeechBtnProps> = ({
  text = 'word',
  type,
  audioURL,
  id,
  backgroundColor,
  setLoading,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>(audioURL || '');
  const [slow, setSlow] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ttsClassname = backgroundColor ? `${backgroundColor} rounded-full p-4` : 'rounded-full p-4';
  const betterText = text.replace(/_+/g, 'ਡੈਸ਼');

  useEffect(() => {
    const generateAudio = async () => {
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
          await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
        }
      } catch (error) {
        console.error('Error generating audio:', error);
      } finally {
        setIsLoading(false);
        setLoading?.(false);
      }
    };
    generateAudio();
  }, [text]);

  const onBtnClick = async () => {
    let justSetAudioUrl = false;
    try {
      if (!audioUrl) {
        setIsLoading(true);
        await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
        justSetAudioUrl = true;
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsLoading(false);
      if (justSetAudioUrl || !isPlaying) {
        audioRef.current?.play();
        setSlow(!slow);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplaying = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
  }, [audioRef.current]);

  useEffect(() => {
    if (audioRef.current) {
      const newSpeed = slow ? CONSTANTS.SLOW_AUDIO_SPEED : CONSTANTS.NORMAL_SPEED;
      audioRef.current.playbackRate = newSpeed;
    }
  }, [slow]);

  return (
    <button className={ttsClassname} onClick={onBtnClick} disabled={isLoading}>
      {isLoading ? (
        <Loading size={'5'} />
      ) : (
        <>
          {slow ? (
            <img src={'/icons/fast.svg'} alt='Fast' width={27} height={27} />
          ) : (
            <img src={'/icons/slow.svg'} alt='Slow' width={27} height={27} />
          )}
          {audioUrl && <audio ref={audioRef} src={audioUrl} />}
        </>
      )}
    </button>
  );
};

export default TextToSpeechBtn;
