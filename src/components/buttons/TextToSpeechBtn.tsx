import React, { Dispatch, FC, useEffect, useRef, useState } from 'react';
import Loading from 'components/loading';
import CONSTANTS from 'constants/constant';
import { generateNarakeetAudio } from 'narakeet';

interface TextToSpeechBtnProps {
  text: string;
  type: string;
  audioURL?: string;
  id?: string;
  classname?: string;
  backgroundColor?: string;
  divider?: string;
  rounded?: boolean;
  setLoading?: Dispatch<boolean>;
  size?: number;
}

const TextToSpeechBtn: FC<TextToSpeechBtnProps> = ({
  text = 'word',
  type,
  audioURL,
  id,
  classname = '',
  rounded = true,
  backgroundColor = '',
  divider = '',
  setLoading,
  size = CONSTANTS.TEXT_TO_SPEECH_BTN_SIZE,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>(audioURL || '');
  const [slow, setSlow] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ttsClassname = backgroundColor
    ? `${backgroundColor} rounded-full p-2 md:p-3`
    : 'rounded-full p-2 md:p-3 ';
  const betterText = text.trim().replace(/_+/g, 'ਡੈਸ਼');

  useEffect(() => {
    const generateAudio = async () => {
      if (!audioURL) {
        setLoading?.(true);
        setIsLoading(true);
        try {
          await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
        } catch (error) {
          console.error('Error generating audio:', error);
        } finally {
          setIsLoading(false);
          setLoading?.(false);
        }
      }
    };
    generateAudio();
  }, [text, audioURL, betterText, type, id, setLoading]);

  const onBtnClick = async () => {
    console.log('TTS button clicked!');
    console.log('audioUrl:', audioUrl);
    console.log('isLoading:', isLoading);
    console.log('audioURL:', audioURL);

    if (audioUrl && !isLoading) {
      try {
        await audioRef.current?.play();
        setSlow(!slow);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
      return;
    }

    setIsLoading(true);
    try {
      await generateNarakeetAudio(betterText, type, setAudioUrl, id ?? undefined);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsLoading(false);
      if (audioUrl) {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

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
         <span className='flex flex-row items-center'>
           {divider}
           <span className='p-3'>
             {slow ? (
               <img src={'/icons/fast.svg'} alt='Fast' width={size} height={size} />
             ) : (
               <img src={'/icons/slow.svg'} alt='Slow' width={size} height={size} />
             )}
             {audioUrl && <audio ref={audioRef} src={audioUrl} />}
           </span>
         </span>
       )}
     </button>
   );
 };

export default TextToSpeechBtn;
