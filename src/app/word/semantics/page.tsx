"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import CONSTANTS from '@/constants';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';
import { WordData, wordData } from '@/constants/wordsData';
import { DragDropContext, Draggable, DraggableStateSnapshot, DraggingState, Droppable, DroppableProvided, DroppableStateSnapshot, DropResult } from 'react-beautiful-dnd';

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? "।" : ".";
  return sentence.endsWith(punctuation) || sentence.endsWith("?") ? sentence : sentence + punctuation;
};

const highlightWord = (sentence: string, lang: string, word: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className="text-black gurmukhi">
      {splitSentence[0]}
      <span className="text-black font-bold">{word}</span>
      {addEndingPunctuation(splitSentence[1], lang)}
    </span>
  );
}

export default function Semantics() {
  // get the word id from the url
  // e.g. /word/examples?id=1
  const wordId = useSearchParams().get('id');

  // Create a ref to store the reference to the HTML element
  const jumpBoxRef = useRef<any>(null);

  // fetch word from state using wordId
  const currentWord = wordData.find((word) => word.id === Number(wordId)) ?? {};
  const [words, setWords] = useState<WordData[]>([]);
  const [synonyms, setSynonyms] = useState<WordData[]>([]);
  const [antonyms, setAntonyms] = useState<WordData[]>([]);

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{CONSTANTS.WORD_NOT_FOUND}</div>
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const newWords = Array.from(words);
    const newSynonyms = Array.from(synonyms);
    const newAntonyms = Array.from(antonyms);

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
      if (sourceId === 'allWords') {
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
          case 'allWords':
            if (sourceId === CONSTANTS.SYNONYMS.toLowerCase()) {
              const newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
              setSynonyms(newSynonyms);
              setWords([...newWords, foundItem]);
            } else if (sourceId === CONSTANTS.ANTONYMS.toLowerCase()) {
              const newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
              setAntonyms(newAntonyms);
              setWords([...newWords, foundItem]);
            }
            break;
          case CONSTANTS.SYNONYMS.toLowerCase():
            if (sourceId === CONSTANTS.ANTONYMS.toLowerCase()) {
              const newAntonyms = antonyms.filter((antonym) => antonym.id !== foundItem.id);
              setAntonyms(newAntonyms);
              setSynonyms([...newSynonyms, foundItem]);
            }
            break;
          case CONSTANTS.ANTONYMS.toLowerCase():
            if (sourceId === CONSTANTS.SYNONYMS.toLowerCase()) {
              const newSynonyms = synonyms.filter((synonym) => synonym.id !== foundItem.id);
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

  const convertToTitleCase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const createSemanticDraggables = (provided: DroppableProvided, wordList: WordData[], snapshot: DroppableStateSnapshot, type: string) => {
    const droppableId = type;
    const heading = type === CONSTANTS.SYNONYMS.toLowerCase() ? CONSTANTS.SYNONYMS : CONSTANTS.ANTONYMS;
    return (
      <div
        className='card-bg shadow-lg rounded-lg w-1/3 h-80 p-4'
        ref={provided.innerRef}
        {...provided.droppableProps}>
        <h2 className='text-center text-black tracking-widest'>{heading.toUpperCase()}</h2>
        <div className='grid grid-cols-2 gap-4 h-full w-full'>
          {wordList?.map((word, index) => {
            return (
              <Draggable 
                key={droppableId+word.id?.toString()}
                draggableId={droppableId+word.id?.toString()}
                index={index}>
                {(dragProvided, dragSnapshot) => {
                  const isDragging = dragSnapshot.isDragging ?? false;
                  const draggingOver = dragSnapshot.draggingOver ?? "";
                  let bgColor = 'bg-[#1F4860]';
                  let color = 'grey';
                  if (isDragging) {
                    bgColor = 'bg-[#1F4860]';
                    if (draggingOver === CONSTANTS.SYNONYMS.toLowerCase()) {
                      bgColor = 'bg-green-500';
                      color = 'green';
                    } else if (draggingOver === CONSTANTS.ANTONYMS.toLowerCase()) {
                      bgColor = 'bg-red-500';
                      color = 'red';
                    }
                  }
                  return (
                  <div
                    draggable
                    className={"flex h-min w-max m-4 p-4 text-white text-sm rounded-lg z-10 "+bgColor}
                    style={{ backgroundColor: color }}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={(el) => {
                      dragProvided.innerRef(el);
                      jumpBoxRef.current = el;
                    }}>
                    {word.word} ({convertToTitleCase(word.translation ?? "")})
                  </div>
                )}}
              </Draggable>
            )
          })}
        </div>
        {provided.placeholder}
      </div>
    )
  }

  const getDraggedItemBackgroundColor = (dragSnapshot: DraggableStateSnapshot, word: WordData) => {
    const isDragging = dragSnapshot.isDragging ?? false;
    const draggingOver = dragSnapshot.draggingOver ?? "";
  
    if (isDragging) {
      switch (draggingOver) {
        case CONSTANTS.SYNONYMS.toLowerCase():
          if (word.type === 'synonym') return 'bg-green-500';
          if (word.type === 'antonym') return 'bg-red-500';
          break;
        case CONSTANTS.ANTONYMS.toLowerCase():
          if (word.type === 'antonym') return 'bg-green-500';
          if (word.type === 'synonym') return 'bg-red-500';
          break;
        default:
          return 'bg-[#1F4860]';
      }
    }
  
    return 'bg-[#1F4860]';
  };

  useEffect(() => {
    const wordsData = wordData.filter((word) => word.id && word.id !== Number(wordId));
    // map through synonyms and antonyms and set its type to 'synonym' or 'antonym'
    const newWordsData: WordData[] = wordsData.map((word) => {
      if (currentWord.synonyms?.includes(Number(word.id))) {
        return {...word, type: 'synonym'};
      }
      if (currentWord.antonyms?.includes(Number(word.id))) {
        return {...word, type: 'antonym'};
      }
      return word;
    });
    // save all to words state
    setWords(newWordsData);
  }, [wordId]);

  useEffect(() => {
    synonyms.map((synonym) => {
      if (!currentWord.synonyms?.includes(Number(synonym.id))) {
        jumpBoxRef.current?.classList.remove('bg-green-500');
        jumpBoxRef.current.classList.add('jump-box');
        jumpBoxRef.current.classList.add('bg-red-500');
        setTimeout(() => {
          jumpBoxRef.current?.classList.remove('jump-box');
          setSynonyms(synonyms.filter((word) => word.id !== Number(synonym.id)));
          setWords([...words, synonym]);
        }, 1000);
      } else {
        jumpBoxRef.current.classList.add('bg-green-500');
        jumpBoxRef.current.classList.add('z-0');
      }
    })
    antonyms.map((antonym) => {
      if (!currentWord.antonyms?.includes(Number(antonym.id))) {
        jumpBoxRef.current?.classList.remove('bg-green-500');
        jumpBoxRef.current.classList.add('jump-box');
        jumpBoxRef.current.classList.add('bg-red-500');
        setTimeout(() => {
          jumpBoxRef.current?.classList.remove('jump-box');
          setAntonyms(antonyms.filter((word) => word.id !== Number(antonym.id)));
          setWords([...words, antonym]);
        }, 1000);
      } else {
        jumpBoxRef.current.classList.add('bg-green-500');
        jumpBoxRef.current.classList.add('z-0');
      }
    })
  }, [synonyms, antonyms, words]);
  
  return (
    <div className="flex flex-col static h-screen items-center justify-between">
      <BackBtn />
      <DragDropContext
        onDragEnd={onDragEnd}>
        <div className='flex flex-col h-full justify-center items-center gap-5 pb-12'>
          <h1 className="text-4xl gurmukhi text-black">{currentWord.word}</h1>
          <h2 className="text-2xl italic text-gray-e4">{currentWord.translation}</h2>
          <Image className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
          <div className="flex flex-col items-center justify-between w-full my-10 mx-5 gap-5">
            <Droppable 
              droppableId="allWords"
              type="COLUMN"
              direction="horizontal"
              >
              {(provided, snapshot) => (
                <div
                  className='flex flex-row justify-between items-center p-4 w-max'
                  // style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {words.map((word, index) => {
                    return (
                      <Draggable key={word.id} draggableId={(word.id ?? "").toString()} index={index}>
                        {(dragProvided, dragSnapshot) => {
                        const bgColor = getDraggedItemBackgroundColor(dragSnapshot, word);
                        return (
                          <div
                            draggable
                            className={"m-4 p-4 text-white text-base rounded-lg "+bgColor}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            ref={dragProvided.innerRef}>
                            <span className='gurmuhki'>{word.word}</span>
                            <span className='brandon-grotesque'> ({convertToTitleCase(word.translation ?? "")})</span>
                        </div>
                        )}}
                      </Draggable>
                    )
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
                  createSemanticDraggables(provided, synonyms, snapshot, CONSTANTS.SYNONYMS.toLowerCase())
                )}
              </Droppable>
              <Droppable
                droppableId={CONSTANTS.ANTONYMS.toLowerCase()}
                type="COLUMN">
                {(provided, snapshot) => (
                  createSemanticDraggables(provided, antonyms, snapshot, CONSTANTS.ANTONYMS.toLowerCase())
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
      <LevelsFooter nextUrl={`/word/semantics?id=${wordId}`} nextText='Next' absolute={true}/>
    </div>
  )
}
