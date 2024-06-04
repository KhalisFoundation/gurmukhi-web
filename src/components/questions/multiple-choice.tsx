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
    const updateOptions = async () => {
      if (selectedOption) {
        setOptionSelected(true);
        if (questionData.options[questionData.answer] === selectedOption) {
          if (currentLevel + ALL_CONSTANT.DEFAULT_ONE <= ALL_CONSTANT.LEVELS_COUNT) {
            await updateCurrentLevel(user.uid, currentLevel + ALL_CONSTANT.DEFAULT_ONE);
            dispatch(increment());
          }
          setIsCorrectOption(true);
        } else {
          setIsCorrectOption(false);
        }
      }
    };

    updateOptions();
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
        await updateWordFromUser(user.uid, questionData.word_id);
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
      <div className='flex flex-row items-center justify-center gap-2 rounded-lg p-4'>
        <h1 className='gurmukhi text-black font-semibold leading-snug md:text-5xl text-xl'>
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
        <div className='w-full h-full'>
          <img
            alt='word-image'
            src={
              questionData?.image
                ? questionData?.image
                : 'https://images.pexels.com/photos/3942924/pexels-photo-3942924.jpeg'
            }
            className='w-2/5 lg:w-1/2 m-auto object-contain rounded-xl'
          />
        </div>
      )}
      <div className={optionsClass}>{renderOptionButtons()}</div>
    </div>
  );
}

