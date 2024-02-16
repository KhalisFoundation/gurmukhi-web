import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, QuestionData } from 'types';
import OptionBtn from 'components/buttons/Option';
import { highlightWord } from 'utils';
import {
  updateCurrentLevel,
  updateWordFromUser,
} from 'database/shabadavalidb';
import TextToSpeechBtn from 'components/buttons/TextToSpeechBtn';
import { increment } from 'store/features/currentLevelSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { useUserAuth } from 'auth';
import ALL_CONSTANT from 'constants/constant';

export default function MultipleChoiceQuestion({
  questionData,
  hasImage,
  setOptionSelected,
  setIsCorrectOption,
}: {
  questionData: QuestionData;
  hasImage?: boolean;
  setOptionSelected: (value: boolean) => void;
  setIsCorrectOption: (value: boolean) => void;
}) {
  const { t: text } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    null,
  );
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const { user } = useUserAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSelectedOption(null);
    setOptionSelected(false);
  }, [questionData]);

  useEffect(() => {
    if (selectedOption) {
      setOptionSelected(true);
      if (questionData.options[questionData.answer] === selectedOption) {
        updateCurrentLevel(user.uid, currentLevel + 1);
        dispatch(increment());
        setIsCorrectOption(true);
      } else {
        setIsCorrectOption(false);
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    const storeData = async () => {
      if (
        user &&
        user.uid &&
        questionData &&
        questionData.id &&
        selectedOption === questionData.options[questionData.answer]
      ) {
        await updateWordFromUser(user.uid, question.word_id);
      }
    };
    storeData();
  }, [questionData, user, selectedOption]);

  const optionsClass = `flex flex-col text-lg grid ${
    hasImage ? 'grid-cols-2' : 'grid-cols-1'
  } m-2 gap-2`;

  if (!questionData) {
    // Handle case when word is not found
    return <div>{text('QUESTION_NOT_FOUND')}</div>;
  }
  const renderOptionButtons = () => {
    return questionData.options.map((option, idx) => {
      const key =
        typeof option === 'object' && option !== null && 'id' in option
          ? option.id
          : idx;
      const isSelected = selectedOption && option === selectedOption;
      return (
        <OptionBtn
          key={key}
          option={option as Option}
          text={text}
          selector={setSelectedOption}
          setOptionSelected={setOptionSelected}
          isCorrect={
            isSelected
              ? questionData.options[questionData.answer] === selectedOption
              : undefined
          }
          disabled={!!selectedOption}
        />
      );
    });
  };

  return (
    <div className='flex flex-col items-left justify-evenly text-center'>
      <div className='flex flex-row items-center justify-between gap-5 rounded-lg p-4'>
        <h1 className={'text-5xl gurmukhi text-black font-semibold'}>
          {highlightWord(questionData.question, questionData.word)}
        </h1>
        <TextToSpeechBtn
          backgroundColor='bg-white-175'
          text={questionData.question}
          type={ALL_CONSTANT.QUESTION}
          id={questionData.id}
        />
      </div>
      {hasImage && (
        <img
          alt='word-image'
          src={
            questionData?.image
              ? questionData?.image
              : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
          }
          className='h-60 object-cover rounded-xl'
        />
      )}
      <div className={optionsClass}>{renderOptionButtons()}</div>
    </div>
  );
}

