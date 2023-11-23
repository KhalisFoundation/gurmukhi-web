"use client"

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import CONSTANTS from '@/constants';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';
import { WordData, wordData } from '@/constants/wordsData';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

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
    const newData = Array.from(words);
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const sourceId = source.droppableId;
      const destinationId = destination.droppableId;
      const [foundItem] = newData.splice(source.index, 1);
      if (sourceId === 'allWords') {
        const newWords = newData.filter((word) => word.id !== foundItem.id);
        switch (destinationId) {
          case 'synonyms':
            // check if word is already in synonyms for current word
            if (synonyms.find((synonym) => synonym.id === foundItem.id)) {
              return;
            } else {
              if (currentWord.synonyms?.includes(Number(foundItem.id))) {
                setSynonyms([...synonyms, foundItem]);
                setWords(newWords);
              }
            }
            break;
          case 'antonyms':
            // check if word is already in antonyms for current word
            if (antonyms.find((antonym) => antonym.id === foundItem.id)) {
              return;
            } else {
              if (currentWord.antonyms?.includes(Number(foundItem.id))) {
                setAntonyms([...antonyms, foundItem]);
                setWords(newWords);
              }
            }
            break;
          default:
            break;
        }
      }
    } else {
        const [reorderedItem] = newData.splice(source.index, 1);
        newData.splice(destination.index, 0, reorderedItem);
        setWords(newData);
    }
  };

  useEffect(() => {
    setWords(wordData.filter((word) => word.id !== Number(wordId)));
  }, [wordId]);
  
  return (
    <div className="flex flex-col static h-screen items-center justify-between">
      <BackBtn />
      <DragDropContext
        onDragEnd={onDragEnd}>
        <div className='flex flex-col h-full justify-center items-center gap-5 pb-12 brandon-grotesque'>
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
                  className='flex flex-row justify-between items-center p-4 w-full'
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {words.map((word, index) => {
                    return (
                      <Draggable key={word.id} draggableId={(word.id ?? "").toString()} index={index}>
                        {(dragProvided) => (
                          <div
                            draggable
                            className="m-4 p-4 bg-[#1F4860] text-white rounded-lg"
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            ref={dragProvided.innerRef}>
                            <span className='gurmuhki'>{word.word}</span> <span className='brandon-grotesque'>({word.translation})</span>
                        </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          <div className="flex items-center justify-around my-10 mx-5 gap-5 w-full">
            <Droppable
              droppableId='synonyms'
              type="COLUMN">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                  {...provided.droppableProps}
                  className='border border-gray-200 border-dashed w-1/3 h-full p-4'>
                  <h2 className='text-center'>Synonyms</h2>
                  {synonyms?.map((synonym, index) => {
                    return (
                      <Draggable key={`synonym${synonym.id}`} draggableId={`synonym${synonym.id}`} index={index}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="m-4 p-4 bg-[#1F4860] text-white rounded-lg">
                            {synonym.word}<br/>({synonym.translation})
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable
              droppableId='antonyms'
              type="COLUMN">
              {(provided, snapshot) => (
                <div
                  className='border border-gray-200 border-dashed w-1/3 h-full p-4'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}>
                  <h2 className='text-center'>Antonyms</h2>
                  {antonyms?.map((antonym, index) => {
                    return (
                      <Draggable key={`antonym${antonym.id}`} draggableId={`antonym${antonym.id}`} index={index}>
                        {(dragProvided) => (
                          <div
                            className="m-4 p-4 bg-[#1F4860] text-white rounded-lg"
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}>
                          {antonym.word}<br/>({antonym.translation})
                        </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          </div>
          <Image className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        </div>
      </DragDropContext>
      <LevelsFooter nextUrl={`/word/semantics?id=${wordId}`} nextText='Next' absolute={true}/>
    </div>
  )
}
