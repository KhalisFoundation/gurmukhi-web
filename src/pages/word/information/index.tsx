import React, { useEffect, useState } from 'react';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import BackBtn from 'components/buttons/BackBtn';
import { WordData, wordData } from 'constants/wordsData';
import { ROUTES } from 'constants/routes';
import { convertToTitleCase, highlightWord } from 'utils/words';

export default function Information() {
  const { t: text } = useTranslation();
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  const [synonyms, setSynonyms] = useState<WordData[]>([]);
  const [antonyms, setAntonyms] = useState<WordData[]>([]);
  
  useEffect(() => {
    const synonymsIndex = currentWord.synonyms ?? [];
    const antonymsIndex = currentWord.antonyms ?? [];
    if (synonymsIndex.length != 0) {
      const currentSynonyms = wordData.filter((word) => word.id && synonymsIndex.includes(word.id));
      setSynonyms(currentSynonyms);
    }
    if (antonymsIndex.length != 0) {
      const currentAntonyms = wordData.filter((word) => word.id && antonymsIndex.includes(word.id));
      setAntonyms(currentAntonyms);
    }
  }, [synonyms, antonyms]);

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className="flex flex-col static h-screen items-center justify-around gap-5">
      <BackBtn />
      <div className='flex flex-col h-3/4 justify-center items-center gap-5'>
        <img className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        <div className="flex flex-row items-center justify-between gap-5">
          <div className="flex flex-col items-left justify-evenly w-1/2 p-8 gap-5">
            <div>
              <div className="flex flex-row items-center justify-between w-4/5">
                <div className="flex flex-col gap-5">
                  <h1 className={'text-5xl gurmukhi text-black'}>{currentWord.word}</h1>
                  <h2 className="text-2xl brandon-grotesque italic text-gray-4e4">{currentWord.translation}</h2>
                </div>
                <TextToSpeechBtn />
              </div>
              <div className="flex flex-col text-lg">
                <span className={'text-black-111'}>{currentWord.meaningEnglish}</span>
                <span className={'text-black'}>{currentWord.meaning}</span>
              </div>
            </div>
            <img
              alt='word-image'
              width={524}
              src={currentWord.image ? currentWord.image : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'}
              className='object-cover rounded-xl'
            />
          </div>,
          <div className="flex flex-col items-left justify-evenly w-3/4">
            <div className="flex flex-col items-left text-left justify-between gap-6">
              <span className="tracking-widest">{text('EXAMPLES').toUpperCase()}</span>
              {
                currentWord.sentences?.map((sentence, index) => {
                  const highlightedSentence = highlightWord(sentence.sentence, 'gurmukhi', currentWord.word ?? '');
                  return (
                    <div key={index} className="flex flex-col text-xl">
                      <span className="text-black-111">
                        {highlightedSentence}
                      </span>
                      <span className="text-black">
                        {sentence.sentenceEnglish.endsWith('.') || sentence.sentence.endsWith('?') ? 
                          sentence.sentenceEnglish : sentence.sentenceEnglish + '.'}
                      </span>
                    </div>
                  );
                })
              }
            </div>
            <div className="flex items-center justify-around my-10 gap-5 w-full">
              <div
                className='card-bg shadow-lg rounded-lg w-2/5 h-64 p-5'>
                <h2 className='text-black tracking-widest ms-2'>{text('SYNONYMS').toUpperCase()}</h2>
                <div className='grid grid-cols-1 m-2 gap-2 h-fit w-full'>
                  {
                    synonyms.map((word) => {
                      return (
                        <div
                          key={word.id}
                          className={'flex h-min w-max p-4 text-black text-sm rounded-lg z-10 bg-white'}>
                          {word.word} ({convertToTitleCase(word.translation ?? '')})
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              <div
                className='card-bg shadow-lg rounded-lg w-2/5 h-64 p-5'>
                <h2 className='text-black tracking-widest ms-2'>{text('ANTONYMS').toUpperCase()}</h2>
                <div className='grid grid-cols-1 m-2 gap-2 h-fit w-full'>
                  {
                    antonyms.map((word) => {
                      return (
                        <div
                          key={word.id}
                          className={'flex h-min w-max p-4 text-black text-sm rounded-lg z-10 bg-white'}>
                          {word.word} ({convertToTitleCase(word.translation ?? '')})
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      { Number(wordId) >= wordData.length - 1 ?
        <LevelsFooter nextUrl={ROUTES.DASHBOARD} nextText='Back to Dashboard' absolute={true}/>
        : <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.DEFINITION}?id=${(Number(wordId) ?? 0) + 1}`} nextText='Next'/>
      }
    </div>
  );
}

Information.propTypes = {};
