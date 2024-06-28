import React, { lazy, useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { getWordById } from 'database/default';
import { showToastMessage } from 'utils';
import { processWords, semanticsOnDrag } from './hooks';
import ALL_CONSTANT from 'constants/constant';
import { useAppSelector } from 'store/hooks';
import { WordType } from 'types';
import CONSTANTS from 'constants/constant';
import Loading from 'components/loading';
const SemanticDraggables = lazy(() => import('./components/SemanticDraggables'));
import semanticWords from 'data/words.json';

export default function Semantics() {
  const { t: text } = useTranslation();
  const location = useLocation();
  const { title, description } = metaTags.SEMANTICS;
  const [wordID, setWordID] = useState<string | null>(null);
  const [words, setWords] = useState<WordType[]>([]);
  const [isLoading, toggleLoading] = useState<boolean | null>(true);
  const [currentWord, setCurrentWord] = useState<WordType | null>(null);
  const [synonyms, setSynonyms] = useState<WordType[]>([]);
  const [isSynonymsDisabled, setIsSynonymsDisabled] = useState<boolean>(false);
  const [antonyms, setAntonyms] = useState<WordType[]>([]);
  const [isAntonymsDisabled, setIsAntonymsDisabled] = useState<boolean>(false);
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const [showConfetti, setShowConfetti] = useState(false);
  const synonymsText = text('SYNONYMS');
  const antonymsText = text('ANTONYMS');
  const jumpBoxRef = useRef<any>(null);
  
  useEffect(() => {
    let semanticIds = currentWord?.synonyms?.map((synonym) => synonym.id) ?? [];
    semanticIds = semanticIds?.concat(currentWord?.antonyms?.map((antonym) => antonym.id) ?? []);
    semanticIds = semanticIds.filter((id) => id !== undefined);

    const semiWords = semanticWords.filter((word) => semanticIds.includes(word.id));
    setWords(semiWords);
  }, [currentWord]);

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
    const synonymIds = new Set(synonyms.map((synonym) => synonym.id));
    const antonymIds = new Set(antonyms.map((antonym) => antonym.id));
    if (!currentWord?.synonyms) {
      return;
    }
    const synonymFound = currentWord.synonyms.map((synonym) => synonym.id && synonymIds.has(synonym.id));
    if (!currentWord.antonyms) {
      return;
    }
    const antonymFound = currentWord.antonyms.map((antonym) => antonym.id && antonymIds.has(antonym.id));
    const allWords = [...synonymFound, ...antonymFound];
    if (allWords.every(Boolean)) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [currentWord, synonyms, antonyms]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!wordID) {
        toggleLoading(false);
        return;
      }
      toggleLoading(true);
      const wordData = await getWordById(wordID, true);
      if (wordData) {
        setCurrentWord(wordData);
      } else {
        setCurrentWord(null);
      }
      toggleLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    location.state?.data ? setCurrentWord(location.state.data) : fetchData();
  }, [wordID]);

  useEffect(() => {
    if (showConfetti) {
      showToastMessage(text('SEMANTICS_PRAISE'), toast.POSITION.TOP_CENTER, true);
      setTimeout(() => {
        setShowConfetti(false);
      }, CONSTANTS.CONFETTI_TIMOUT);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (!currentWord) {
      toggleLoading(false);
      return;
    }
    toggleLoading(true);
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
    toggleLoading(false);
  }, [synonyms, antonyms, words, currentWord]);

  if (!currentWord) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col h-full w-full items-center justify-between'>
      <Meta title={title} description={description} />
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
                  <SemanticDraggables
                    provided={provided}
                    wordList={synonyms}
                    type={synonymsText.toLowerCase()}
                    text={text}
                    originalSemantics={currentWord.synonyms as (string | number)[]}
                    disableDroppable={setIsSynonymsDisabled}
                    boxRef={jumpBoxRef}
                  />
                }
              </Droppable>
              <Droppable
                type='COLUMN'
                droppableId={antonymsText.toLowerCase()}
                isDropDisabled={isAntonymsDisabled}
              >
                {(provided) =>
                  <SemanticDraggables
                    provided={provided}
                    wordList={antonyms}
                    type={antonymsText.toLowerCase()}
                    text={text}
                    originalSemantics={currentWord.antonyms as (string | number)[]}
                    disableDroppable={setIsAntonymsDisabled}
                    boxRef={jumpBoxRef}
                  />
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
        isDisabled={false}
        isLoading={isLoading}
      />
    </div>
  );
}
