import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackBtn from 'components/buttons/BackBtn';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { WordData, wordData } from 'constants/wordsData';
import { showToastMessage, createSemanticDraggables } from 'utils';
import { processWords, semanticsOnDrag, updateSemanticWordsData } from './hooks';
import ALL_CONSTANT from 'constants/constant';
import { useAppSelector } from 'store/hooks';

export default function Semantics() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.SEMANTICS;
  // Use useLocation to get the search parameters from the URL
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id') ?? '';
  const synonymsText = text('SYNONYMS');
  const antonymsText = text('ANTONYMS');

  // Create a ref to store the reference to the HTML element
  const jumpBoxRef = useRef<any>(null);

  // fetch word from state using wordId
  const currentWord = useMemo(() => wordData.find((word) => word.id === wordId) ?? {}, [wordId]);
  const [words, setWords] = useState<WordData[]>([]);
  const [synonyms, setSynonyms] = useState<WordData[]>([]);
  const [isSynonymsDisabled, setIsSynonymsDisabled] = useState<boolean>(false);
  const [antonyms, setAntonyms] = useState<WordData[]>([]);
  const [isAntonymsDisabled, setIsAntonymsDisabled] = useState<boolean>(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    semanticsOnDrag(
      source,
      destination,
      text,
      words,
      synonyms,
      antonyms,
      setWords,
      setSynonyms,
      setAntonyms,
    );
  };

  useEffect(() => {
    updateSemanticWordsData(wordId, currentWord, wordData, setWords);
  }, []);

  useEffect(() => {
    const synonymIds = new Set(synonyms.map((synonym) => synonym.id));
    const antonymIds = new Set(antonyms.map((antonym) => antonym.id));

    const synonymFound = currentWord.synonyms
      ? currentWord.synonyms.map((synonymId) => synonymIds.has(synonymId))
      : [];

    const antonymFound = currentWord.antonyms
      ? currentWord.antonyms.map((antonymId) => antonymIds.has(antonymId))
      : [];

    const allWords = [...synonymFound, ...antonymFound];
    // if all words are found, show confetti
    if (allWords.every((wordFound) => wordFound)) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [currentWord, synonyms, antonyms]);

  useEffect(() => {
    if (showConfetti) {
      showToastMessage(text('SEMANTICS_PRAISE'), toast.POSITION.TOP_CENTER, true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    }
  }, [showConfetti]);

  useEffect(() => {
    processWords(
      synonyms,
      text('SYNONYMS'),
      jumpBoxRef,
      currentWord,
      words,
      synonyms,
      antonyms,
      setWords,
      setSynonyms,
      setAntonyms,
    );
    processWords(
      antonyms,
      text('ANTONYMS'),
      jumpBoxRef,
      currentWord,
      words,
      synonyms,
      antonyms,
      setWords,
      setSynonyms,
      setAntonyms,
    );
  }, [synonyms, antonyms, words, currentWord]);

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col h-screen items-center justify-between'>
      <Meta title={title} description={description} />
      <BackBtn navlink={-1} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex flex-col h-full justify-center items-center gap-5 pb-12'>
          <h1 className='text-4xl gurmukhi text-black'>{currentWord.word}</h1>
          <h2 className='text-2xl italic text-gray-e4'>{currentWord.translation}</h2>
          <img className='w-3/5 h-6' src='/icons/pointy_border.svg' alt='border-top' />
          <div className='flex flex-col items-center justify-between w-full my-10 mx-5 gap-5'>
            {showConfetti && <Confetti />}
            <ToastContainer />
            <Droppable droppableId={text('ALL_WORDS')} type='COLUMN' direction='horizontal'>
              {(provided) => (
                <div
                  className='flex flex-row justify-between items-center p-4 w-max'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {words.map((word, index) => {
                    return (
                      <Draggable
                        key={word.id}
                        draggableId={(word.id ?? '').toString()}
                        index={index}
                      >
                        {(dragProvided) => {
                          return (
                            <div
                              draggable
                              className={'m-4 p-4 text-white text-base rounded-lg bg-darkBlue'}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              ref={dragProvided.innerRef}
                            >
                              <span className='gurmuhki'>{word.word}</span>
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className='flex items-center justify-around my-10 mx-5 gap-5 w-full'>
              <Droppable
                type='COLUMN'
                droppableId={synonymsText.toLowerCase()}
                isDropDisabled={isSynonymsDisabled}
              >
                {(provided) =>
                  createSemanticDraggables(
                    provided,
                    synonyms,
                    synonymsText.toLowerCase(),
                    text,
                    currentWord.synonyms as (string | number)[],
                    setIsSynonymsDisabled,
                    jumpBoxRef,
                  )
                }
              </Droppable>
              <Droppable
                type='COLUMN'
                droppableId={antonymsText.toLowerCase()}
                isDropDisabled={isAntonymsDisabled}
              >
                {(provided) =>
                  createSemanticDraggables(
                    provided,
                    antonyms,
                    antonymsText.toLowerCase(),
                    text,
                    currentWord.antonyms as (string | number)[],
                    setIsAntonymsDisabled,
                    jumpBoxRef,
                  )
                }
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
      <LevelsFooter
        operation={ALL_CONSTANT.NEXT}
        nextText='Next'
        absolute={true}
        currentLevel={currentLevel}
        currentGamePosition={currentGamePosition}
      />
    </div>
  );
}
