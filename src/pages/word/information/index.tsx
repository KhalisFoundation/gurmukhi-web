import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { WordType } from 'types';
import { convertToTitleCase, highlightWord } from 'utils';
import { getWordById } from 'database/default';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { MiniWord, SentenceType } from 'types';
import ALL_CONSTANT from 'constants/constant';
import { useAppSelector } from 'store/hooks';
import Loading from 'components/loading';

export default function Information() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.INFORMATION;
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const [wordID, setWordID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [currentWord, setCurrentWord] = useState<WordType | null>(null);
  const [isRandom, setIsRandom] = useState<boolean>(false);
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
  }, [location.search]);

  // fetch word from state using wordId
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!wordID) {
        setIsLoading(false);
        return;
      }
      const words = await getWordById(wordID, true);
      if (words !== null) {
        setCurrentWord(words);
      }
      setIsLoading(false);
    };

    if (location.state?.isRandom) {
      setIsRandom(location.state.isRandom);
    }
    if (location.state?.data) {
      setCurrentWord(location.state.data);
      setIsLoading(false);
    } else {
      fetchData();
    }
  }, [wordID]);
  const renderFooter = () => {
    const operation = isRandom ? ALL_CONSTANT.START_QUESTION : ALL_CONSTANT.NEXT;
    const nextText = isRandom ? ALL_CONSTANT.START_LEARNING : 'Next';

    return (
      <LevelsFooter
        operation={operation}
        nextText={nextText}
        currentLevel={currentLevel}
        currentGamePosition={currentGamePosition}
        isDisabled={false}
        isLoading={isLoading}
      />
    );
  };

  if (isLoading) {
    // Handle case when word is not found
    return <Loading />;
  }

  return (
    <div className='flex flex-col items-center w-full lg:h-full justify-between gap-5'>
      <Meta title={title} description={description} />
      <div className='flex flex-col h-full justify-between items-center'>
        <img
          className='w-3/5 h-6'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-between h-full gap-10 w-full py-10 overflow-y-auto xl:flex-row'>
          <div className='flex flex-col items-left justify-evenly w-3/4 h-full xl:w-1/2'>
            <div>
              <div className='flex flex-row items-center justify-between w-4/5'>
                <div className='flex flex-col gap-5'>
                  <h1 className={'text-5xl gurmukhi text-black'}>{currentWord?.word}</h1>
                  <h2 className='text-2xl brandon-grotesque italic text-gray-4e4'>
                    {currentWord?.translation}
                  </h2>
                </div>
                {currentWord && currentWord.word && (
                  <TextToSpeechBtn
                    backgroundColor='bg-white-150'
                    text={currentWord.word}
                    type={ALL_CONSTANT.WORD}
                    id={currentWord.id}
                    audioURL={currentWord.audioURL}
                  />
                )}
              </div>
              <div className='flex flex-col text-lg'>
                <span className={'text-black'}>{currentWord?.meaning_punjabi}</span>
                <span className={'text-black-111'}>{currentWord?.meaning_english}</span>
              </div>
            </div>
            <img
              alt='word-image'
              width={524}
              src={
                currentWord?.images
                  ? currentWord.images[0]
                  : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
              }
              className='object-cover rounded-xl'
            />
          </div>
          <div className='flex flex-col items-left justify-evenly w-3/4 h-full gap-5'>
            <div className='flex flex-col items-left text-justify justify-between gap-6'>
              <span className='tracking-widest text-center xl:text-left'>
                {text('EXAMPLES').toUpperCase()}
              </span>
              {currentWord?.sentences &&
                currentWord.sentences.map((sentence: SentenceType, index: number) => {
                  const highlightedSentence = highlightWord(
                    sentence.sentence,
                    currentWord.word ?? '',
                    'gurmukhi',
                  );
                  return (
                    <div key={index} className='flex flex-col text-xl'>
                      <span className='text-black-111'>
                        {highlightedSentence}
                        {sentence && sentence.sentence && (
                          <TextToSpeechBtn
                            backgroundColor='bg-white-150'
                            text={sentence.sentence}
                            type={ALL_CONSTANT.SENTENCE}
                            audioURL={sentence.audioURL}
                            id={currentWord.id}
                          />
                        )}
                      </span>
                      <span className='text-black'>
                        {sentence.translation.endsWith('.') || sentence.sentence.endsWith('?')
                          ? sentence.translation
                          : sentence.translation + '.'}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className='flex items-center justify-around gap-5 w-full h-1/2'>
              {currentWord?.synonyms && currentWord.synonyms.length === 0 && (
                <div className={'w-5/6 h-full cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg lg:w-2/5'}>
                  <h2 className='text-black tracking-widest ms-2 my-2'>
                    {text('SYNONYMS').toUpperCase()}
                  </h2>
                  <div className='w-11/12 flex flex-col gap-2 m-auto'>
                    {currentWord?.synonyms &&
                      currentWord.synonyms.map((word: MiniWord | string) => {
                        if (typeof word !== 'string') {
                          return (
                            <div
                              key={word.id}
                              className={
                                'flex h-min w-full p-4 text-black text-sm rounded-lg z-10 bg-white'
                              }
                            >
                              {word.word} ({convertToTitleCase(word.translation ?? '')})
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>)}
              {currentWord?.antonyms && currentWord.antonyms.length === 0 && (
                <div className={'w-5/6 h-full cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg lg:w-2/5'}>
                  <h2 className='text-black tracking-widest ms-2 my-2'>
                    {text('ANTONYMS').toUpperCase()}
                  </h2>
                  <div className='w-11/12 flex flex-col gap-2 m-auto'>
                    {currentWord?.antonyms &&
                      currentWord.antonyms.map((word: MiniWord | string) => {
                        if (typeof word !== 'string') {
                          return (
                            <div
                              key={word.id}
                              className={
                                'flex h-min w-full p-4 text-black text-sm rounded-lg z-10 bg-white'
                              }
                            >
                              {word.word} ({convertToTitleCase(word.translation ?? '')})
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        <img
          className='w-3/5 h-6 rotate-180'
          src='/icons/pointy_border.svg'
          alt='border-top'
          width={200}
          height={200}
        />
      </div>
      {renderFooter()}
    </div>
  );
}
