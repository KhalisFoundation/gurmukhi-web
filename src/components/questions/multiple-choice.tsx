import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionData } from 'types';
import OptionBtn from 'components/buttons/Option';


export default function MultipleChoiceQuestion({ question, hasImage }: { question: QuestionData, hasImage?: boolean }) {
  const { t: text } = useTranslation();

  if (!question) {
    // Handle case when word is not found
    return <div>{text('QUESTION_NOT_FOUND')}</div>;
  }

  return (
    <div className="flex flex-row items-center justify-between gap-5">
      <div className="flex flex-col items-left justify-evenly p-8 gap-5">
        {hasImage && 
          <img
            alt='word-image'
            width={524}
            src={question?.image ? question?.image : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'}
            className='object-cover rounded-xl'
          />
        }
        <h1 className={'text-5xl gurmukhi text-black'}>{question.question}</h1>
        <div className="flex flex-col text-lg grid grid-cols-1 m-2 gap-2">
          {question.options.map((option) => (
            <OptionBtn option={option} backgroundColor='white' />
          ))}
        </div>
      </div>
    </div>
  );
}

MultipleChoiceQuestion.propTypes = {};
