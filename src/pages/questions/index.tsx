import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import { WordData } from 'constants/wordsData';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';
import { NewQuestionType, QuestionData } from 'types';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { getQuestionByID } from 'database/question';
import { getWordById } from 'utils';
import { useAppSelector } from 'store/hooks';

export default function Question() {
  const { t: text } = useTranslation();
  const { title, description } = metaTags.QUESTION;
  const currentGamePosition = useAppSelector(
    (state) => state.currentGamePosition,
  );
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const [wordID, setWordID] = useState<string | null>(null);
  const [questionID, setQuestionID] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null,
  );
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const learningWords = useAppSelector((state) => state.learningWords);
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
    setQuestionID(searchParams.get('qid'));
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!wordID || !questionID) {
        return;
      }
      const question = await getQuestionByID(questionID);
      if (question !== null) {
        setCurrentQuestion(question);
        const word = await getWordById(wordID);
        if (word !== null) {
          setCurrentWord(word);
        }
        return;
      }
    };
    fetchData();
  }, [wordID, learningWords, questionID]);

  const questionData = useMemo(() => {
    return { ...currentQuestion, word: currentWord } as NewQuestionType;
  }, [currentQuestion, currentWord]);

  const getQuestionElement = () => {
    switch (currentQuestion?.type) {
      case 'image':
        return (
          <MultipleChoiceQuestion
            question={{ ...questionData, image: currentWord?.image }}
            hasImage={true}
            setIsOptionSelected={setIsOptionSelected}
          />
        );
      default:
        return (
          <MultipleChoiceQuestion
            question={questionData as NewQuestionType}
            setIsOptionSelected={setIsOptionSelected}
          />
        );
    }
  };

  const renderFooter = () => {
    return (
      <LevelsFooter
        operation={ALL_CONSTANT.NEXT}
        nextText='Next'
        currentLevel={currentLevel}
        currentGamePosition={currentGamePosition + 1}
        isDisabled={!isOptionSelected}
      />
    );
  };

  if (!currentQuestion) {
    // Handle case when word is not found
    return <div>{text('WORD_NOT_FOUND')}</div>;
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <Meta title={title} description={description} />
      <div className='flex-1 flex-col overflow-y-auto'>
        <div className='flex flex-col items-center h-full justify-between'>
          <img
            className='w-1/3 h-6'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
          {getQuestionElement()}
          <img
            className='w-1/3 h-6 rotate-180'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
        </div>
      </div>
      {renderFooter()}
    </div>
  );
}
