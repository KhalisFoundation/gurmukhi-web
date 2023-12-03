'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import CONSTANTS from '@/constants';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';
import { WordData, wordData } from '@/constants/wordsData';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { convertToTitleCase, createSemanticDraggables, getDraggedItemBackgroundColor } from '@/utils/words';

export default function Semantics() {
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // Create a ref to store the reference to the HTML element
  const jumpBoxRef = useRef<any>(null);

  // fetch word from state using wordId
  const currentWord = useMemo(() => wordData.find((word) => word.id === Number(wordId)) ?? {}, [wordId]);
  const [words, setWords] = useState<WordData[]>([]);
  const [synonyms, setSynonyms] = useState<WordData[]>([]);
  const [antonyms, setAntonyms] = useState<WordData[]>([]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const newWords = Array.from(words);
    let newSynonyms = Array.from(synonyms);
    let newAntonyms = Array.from(antonyms);

    let newData = Array.from(words);
    switch (source.droppableId) {
      case CONSTANTS.SYNONYMS.toLowerCase():
        newData = newSynonyms;
        break;
      case CONSTANTS.ANTONYMS.toLowerCase():
        newData = newAntonyms;
        break;
      default:
        break;
    }
    const [foundItem] = newData.splice(source.index, 1);
      
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const sourceId = source.droppableId;
      const destinationId = destination.droppableId;
      if (sourceId === CONSTANTS.ALL_WORDS) {
        const newWordLists = newWords.filter((word) => word.id !== foundItem.id);
        switch (destinationId) {
          case CONSTANTS.SYNONYMS.toLowerCase():
            setSynonyms([...synonyms, foundItem]);
            setWords(newWordLists);
            break;
          case CONSTANTS.ANTONYMS.toLowerCase():
            setAntonyms([...antonyms, foundItem]);
            setWords(newWordLists);
            // check if word is already in antonyms for current word
            // the following code doesn't allow users to make mistakes
            // if (antonyms.find((antonym) => antonym.id === foundItem.id)) {
            //   return;
            // } else {
            //   if (currentWord.antonyms?.includes(Number(foundItem.id))) {
            //   }
            // }
            break;
          default:
            break;
        }
      } else {
        switch (destinationId) {
          case CONSTANTS.ALL_WORDS:
            if (sourceId === CONSTANTS.SYNONYMS.toLowerCase()) {
              newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
              setSynonyms(newSynonyms);
              setWords([...newWords, foundItem]);
            } else if (sourceId === CONSTANTS.ANTONYMS.toLowerCase()) {
              newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
              setAntonyms(newAntonyms);
              setWords([...newWords, foundItem]);
            }
            break;
          case CONSTANTS.SYNONYMS.toLowerCase():
            if (sourceId === CONSTANTS.ANTONYMS.toLowerCase()) {
              newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
              setAntonyms(newAntonyms);
              setSynonyms([...newSynonyms, foundItem]);
            }
            break;
          case CONSTANTS.ANTONYMS.toLowerCase():
            if (sourceId === CONSTANTS.SYNONYMS.toLowerCase()) {
              newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
              setSynonyms(newSynonyms);
              setAntonyms([...newAntonyms, foundItem]);
            }
            break;
          default:
            break;
        }
      }
    } else {
      newData.splice(destination.index, 0, foundItem);
      if (source.droppableId === CONSTANTS.SYNONYMS.toLowerCase()) setSynonyms(newData);
      else if (source.droppableId === CONSTANTS.ANTONYMS.toLowerCase()) setAntonyms(newData);
      else setWords(newData);
    }
  };

  useEffect(() => {
    const updateWordsData = () => {
      const wordsData = wordData.filter((word) => word.id && word.id !== Number(wordId));
      // map through synonyms and antonyms and set its type to 'synonym' or 'antonym'
      const newWordsData: WordData[] = wordsData.map((word) => {
        if (currentWord.synonyms?.includes(Number(word.id))) {
          return { ...word, type: 'synonym' };
        }
        if (currentWord.antonyms?.includes(Number(word.id))) {
          return { ...word, type: 'antonym' };
        }
        return word;
      });
      // save all to words state
      setWords(newWordsData);
    };
  
    // Call the function unconditionally
    updateWordsData();
  }, [wordId, currentWord]);  

  useEffect(() => {
    const processWords = (wordList: WordData[], type: keyof WordData) => {
      wordList.forEach((word) => {
        if (!(currentWord[type] as (number | string)[]).includes(Number(word.id))) {
          jumpBoxRef.current?.classList.remove('bg-green-500');
          jumpBoxRef.current.classList.add('jump-box');
          jumpBoxRef.current.classList.add('bg-red-500');
          setTimeout(() => {
            jumpBoxRef.current?.classList.remove('jump-box');
  
            if (type === 'synonyms') {
              setSynonyms(synonyms.filter((synonym) => synonym.id !== Number(word.id)));
            } else if (type === 'antonyms') {
              setAntonyms(antonyms.filter((antonym) => antonym.id !== Number(word.id)));
            }
  
            setWords([...words, word]);
          }, 1000);
        } else {
          jumpBoxRef.current.classList.add('bg-green-500');
          jumpBoxRef.current.classList.add('z-0');
        }
      });
    };
  
    processWords(synonyms, 'synonyms');
    processWords(antonyms, 'antonyms');
  }, [synonyms, antonyms, words, currentWord]);  
  

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{CONSTANTS.WORD_NOT_FOUND}</div>;
  }
  return (
    <div className="flex flex-col static h-screen items-center justify-between">
      <BackBtn />
      <DragDropContext
        onDragEnd={onDragEnd}>
        <div className='flex flex-col h-full justify-center items-center gap-5 pb-12'>
          <h1 className="text-4xl gurmukhi text-black">{currentWord.word}</h1>
          <h2 className="text-2xl italic text-gray-e4">{currentWord.translation}</h2>
          <img className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" />
          <div className="flex flex-col items-center justify-between w-full my-10 mx-5 gap-5">
            <Droppable 
              droppableId={CONSTANTS.ALL_WORDS}
              type="COLUMN"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  className='flex flex-row justify-between items-center p-4 w-max'
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {words.map((word, index) => {
                    return (
                      <Draggable key={word.id} draggableId={(word.id ?? '').toString()} index={index}>
                        {(dragProvided, dragSnapshot) => {
                          const bgColor = getDraggedItemBackgroundColor(dragSnapshot, word);
                          return (
                            <div
                              draggable
                              className={'m-4 p-4 text-white text-base rounded-lg ' + bgColor}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              ref={dragProvided.innerRef}>
                              <span className='gurmuhki'>{word.word}</span>
                              <span className='brandon-grotesque'> ({convertToTitleCase(word.translation ?? '')})</span>
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

            <div className="flex items-center justify-around my-10 mx-5 gap-5 w-full">
              <Droppable
                droppableId={CONSTANTS.SYNONYMS.toLowerCase()}
                type="COLUMN">
                {(provided, snapshot) => (
                  createSemanticDraggables(provided, synonyms, snapshot, CONSTANTS.SYNONYMS.toLowerCase(), jumpBoxRef)
                )}
              </Droppable>
              <Droppable
                droppableId={CONSTANTS.ANTONYMS.toLowerCase()}
                type="COLUMN">
                {(provided, snapshot) => (
                  createSemanticDraggables(provided, antonyms, snapshot, CONSTANTS.ANTONYMS.toLowerCase(), jumpBoxRef)
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
      <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.INFORMATION}?id=${wordId}`} nextText='Next' absolute={true}/>
    </div>
  );
}
