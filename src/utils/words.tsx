import React, { MutableRefObject } from 'react';
import { Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { TFunction } from 'i18next';
import { WordType } from 'types';

const convertToTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? '।' : '.';
  const numberOfSpaces = (sentence.match(/ /g) || []).length;
  if (numberOfSpaces === 0 && lang === 'gurmukhi')
    return sentence.replace(/।/g, '');
  return numberOfSpaces === 0 ||
    sentence.endsWith(punctuation) ||
    sentence.endsWith('?')
    ? sentence
    : sentence + punctuation;
};

const highlightWord = (sentence: string, word: string, lang?: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className='text-slate-500 gurmukhi font-semibold'>
      {splitSentence[0]}
      <span className='text-black'>{word}</span>
      {lang ? addEndingPunctuation(splitSentence[1], lang) : splitSentence[1]}
    </span>
  );
};

const createSemanticDraggables = (
  provided: DroppableProvided,
  wordList: WordType[],
  type: string,
  text: TFunction<'translation', undefined>,
  originalSemantics: (string | number)[],
  disableDroppable: React.Dispatch<React.SetStateAction<boolean>>,
  boxRef?: MutableRefObject<any>,
) => {
  const synonyms = text('SYNONYMS');
  const antonyms = text('ANTONYMS');
  const droppableId = type;
  const heading = type === synonyms.toLowerCase() ? synonyms : antonyms;
  const semanticsLeft = originalSemantics.filter(
    (wordId) => !wordList.some((word) => word.id === wordId),
  ).length;
  if (semanticsLeft === 0) disableDroppable(true);
  return (
    <div
      className='h-72 w-80 p-4 cardImage bg-cover bg-sky-100 bg-blend-soft-light border-2 border-sky-200 shadow-lg rounded-lg'
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <h2 className='text-center text-black tracking-widest'>{`${heading.toUpperCase()} - ${
        semanticsLeft === 0 ? '✓' : semanticsLeft
      }`}</h2>
      <div className='grid grid-cols-2 gap-4 h-60 w-72'>
        {wordList?.map((word, index) => {
          return (
            <Draggable
              key={droppableId + word.id?.toString()}
              draggableId={droppableId + word.id?.toString()}
              isDragDisabled={semanticsLeft == 0}
              index={index}
            >
              {(dragProvided) => {
                return (
                  <div
                    draggable
                    className={
                      'flex h-min w-max m-4 p-4 text-white text-sm rounded-lg z-10'
                    }
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={(el) => {
                      dragProvided.innerRef(el);
                      if (boxRef) boxRef.current = el;
                    }}
                  >
                    {word.word}
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

export {
  addEndingPunctuation,
  highlightWord,
  convertToTitleCase,
  createSemanticDraggables,
};
