import React, { MutableRefObject } from 'react';
import { TFunction } from 'i18next';
import { Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { WordType } from 'types';

interface SemanticDraggablesProps {
  provided: DroppableProvided;
  wordList: WordType[];
  type: string;
  text: TFunction<'translation', undefined>;
  originalSemantics: (string | number)[];
  disableDroppable: React.Dispatch<React.SetStateAction<boolean>>;
  boxRef?: MutableRefObject<any>;
}

const SemanticDraggables = ({ ...props } : SemanticDraggablesProps) => {
  const synonyms = props.text('SYNONYMS');
  const antonyms = props.text('ANTONYMS');
  const droppableId = props.type;
  const heading = props.type === synonyms.toLowerCase() ? synonyms : antonyms;
  const semanticsLeft = props.originalSemantics.filter(
    (wordId) => !props.wordList.some((word) => word.id === wordId),
  ).length;

  if (semanticsLeft === 0) props.disableDroppable(true);

  return (
    <div
      className='h-72 w-80 p-4 cardImage bg-cover bg-sky-100 bg-blend-soft-light border-2 border-sky-200 shadow-lg rounded-lg'
      ref={props.provided.innerRef}
      {...props.provided.droppableProps}
    >
      <h2 className='text-center text-black tracking-widest'>{`${heading.toUpperCase()} - ${
        semanticsLeft === 0 ? '✓' : semanticsLeft
      }`}</h2>
      <div className='grid grid-cols-2 gap-4 h-60 w-72'>
        {props.wordList?.map((word, index) => {
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
                    className={'flex h-min w-max m-4 p-4 text-white text-sm rounded-lg z-10'}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={(el) => {
                      dragProvided.innerRef(el);
                      if (props.boxRef) props.boxRef.current = el;
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
      {props.provided.placeholder}
    </div>
  );
};

export default SemanticDraggables;