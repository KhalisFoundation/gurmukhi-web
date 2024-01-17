import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NewQuestionType, Option } from 'types';
import OptionBtn from 'components/buttons/Option';
import { highlightWord } from 'utils';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import { increment } from 'store/features/currentLevelSlice';
import { useAppDispatch } from 'store/hooks';

export default function MultipleChoiceQuestion({
  question,
  hasImage,
  setOptionSelected,
}: {
  question: NewQuestionType;
  hasImage?: boolean;
  setOptionSelected: (value: boolean) => void;
}) {
  const { t: text } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    null,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSelectedOption(null);
    setOptionSelected(false);
  }, [question]);
  useEffect(() => {
    if (selectedOption) {
      setOptionSelected(true);
      if (question.options[question.answer] === selectedOption) {
        console.log('question is correct');
        dispatch(increment());
      }
    }
  }, [selectedOption]);

  const optionsClass = `flex flex-col text-lg grid ${
    hasImage ? 'grid-cols-2' : 'grid-cols-1'
  } m-2 gap-2`;

  if (!question) {
    // Handle case when word is not found
    return <div>{text('QUESTION_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col items-left justify-evenly text-center'>
      <div className='flex flex-row items-center justify-between gap-5 rounded-lg p-4'>
        <h1 className={'text-5xl gurmukhi text-black font-semibold'}>
          {highlightWord(question.question, question.word)}
        </h1>
        <TextToSpeechBtn backgroundColor='bg-white-175' />
      </div>
      {hasImage && (
        <img
          alt='word-image'
          src={
            question?.image
              ? question?.image
              : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
          }
          className='h-60 object-cover rounded-xl'
        />
      )}
      <div className={optionsClass}>
        {question.options.map((option, idx) => {
          if (selectedOption && option === selectedOption) {
            return (
              <OptionBtn
                key={option.id ?? idx}
                option={option as Option}
                text={text}
                selector={setSelectedOption}
                word_id={question.word_id}
                isCorrect={question.options[question.answer] === selectedOption}
                disabled={!!selectedOption}
              />
            );
          } else {
            return (
              <OptionBtn
                key={option.id ?? idx}
                option={option as Option}
                text={text}
                selector={setSelectedOption}
                disabled={!!selectedOption}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

MultipleChoiceQuestion.propTypes = {};
