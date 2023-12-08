import React, { MutableRefObject } from 'react';
import { Draggable, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { TFunction } from 'i18next';
import { WordData } from 'constants/wordsData';

const convertToTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? '।' : '.';
  return sentence.endsWith(punctuation) || sentence.endsWith('?') ? sentence : sentence + punctuation;
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
};

const createSemanticDraggables = (provided: DroppableProvided, wordList: WordData[], snapshot: DroppableStateSnapshot, type: string, text: TFunction<'translation', undefined>, boxRef?: MutableRefObject<any>) => {
  const synonyms = text('SYNONYMS');
  const antonyms = text('ANTONYMS');
  const droppableId = type;
  const heading = type === synonyms.toLowerCase() ? synonyms : antonyms;
  return (
    <div
      className='card-bg shadow-lg rounded-lg h-72 w-80 p-4'
      ref={provided.innerRef}
      {...provided.droppableProps}>
      <h2 className='text-center text-black tracking-widest'>{heading.toUpperCase()}</h2>
      <div className='grid grid-cols-2 gap-4 h-60 w-72'>
        {wordList?.map((word, index) => {
          return (
            <Draggable 
              key={droppableId + word.id?.toString()}
              draggableId={droppableId + word.id?.toString()}
              index={index}>
              {(dragProvided, dragSnapshot) => {
                const isDragging = dragSnapshot.isDragging ?? false;
                const draggingOver = dragSnapshot.draggingOver ?? '';
                let bgColor = 'bg-[#1F4860]';
                let color = 'grey';
                if (isDragging) {
                  bgColor = 'bg-[#1F4860]';
                  if (draggingOver === synonyms.toLowerCase()) {
                    bgColor = 'bg-green-500';
                    color = 'green';
                  } else if (draggingOver === antonyms.toLowerCase()) {
                    bgColor = 'bg-red-500';
                    color = 'red';
                  }
                }
                return (
                  <div
                    draggable
                    className={'flex h-min w-max m-4 p-4 text-white text-sm rounded-lg z-10 ' + bgColor}
                    style={{ backgroundColor: color }}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={(el) => {
                      dragProvided.innerRef(el);
                      if (boxRef) boxRef.current = el;
                    }}>
                    {word.word} ({convertToTitleCase(word.translation ?? '')})
                  </div>
                );
              }}
            </Draggable>
          );
        })}
      </div>
      {provided.placeholder}
    </div>
  );
};

const getDraggedItemBackgroundColor = (dragSnapshot: DraggableStateSnapshot, word: WordData, text: TFunction<'translation', undefined>) => {
  const synonyms = text('SYNONYMS');
  const antonyms = text('ANTONYMS');
  const isDragging = dragSnapshot.isDragging ?? false;
  const draggingOver = dragSnapshot.draggingOver ?? '';

  if (isDragging) {
    switch (draggingOver) {
      case synonyms.toLowerCase():
        if (word.type === 'synonym') return 'bg-green-500';
        if (word.type === 'antonym') return 'bg-red-500';
        break;
      case antonyms.toLowerCase():
        if (word.type === 'antonym') return 'bg-green-500';
        if (word.type === 'synonym') return 'bg-red-500';
        break;
      default:
        return 'bg-[#1F4860]';
    }
  }
  return 'bg-[#1F4860]';
};

export { 
  addEndingPunctuation,
  highlightWord,
  convertToTitleCase, 
  createSemanticDraggables, 
  getDraggedItemBackgroundColor,
};