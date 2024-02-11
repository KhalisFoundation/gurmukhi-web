import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LevelsFooter from 'components/levels-footer/LevelsFooter';
import MultipleChoiceQuestion from 'components/questions/multiple-choice';
import { QuestionData } from 'types';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import ALL_CONSTANT from 'constants/constant';
import { getQuestionByID } from 'database/default/question';
import { useAppSelector } from 'store/hooks';
import Loading from 'components/loading';

export default function Question() {
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
  const [isCorrectOption, setIsCorrectOption] = useState<boolean | null>(null);
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setWordID(searchParams.get('id'));
    setQuestionID(searchParams.get('qid'));
  }, [location.search]);

  useEffect(() => {
    // Reset option selected state when question changes
    setIsOptionSelected(false);
  }, [currentQuestion]);

  useEffect(() => {
    const fetchData = async () => {
      if (!wordID || !questionID) {
        return;
      }
      const question = await getQuestionByID(questionID);
      if (question !== null) {
        setCurrentQuestion(question);
        return;
      }
    };
    const data = location.state.data;
    if (data) {
      setCurrentQuestion(data);
    } else {
      fetchData();
    }
  }, [wordID, questionID]);

  const questionData = useMemo(() => {
    return { ...currentQuestion } as QuestionData;
  }, [currentQuestion]);

  const getQuestionElement = () => {
    return (
      <MultipleChoiceQuestion
        question={questionData}
        hasImage={currentQuestion?.type === 'image'}
        setOptionSelected={setIsOptionSelected}
        setIsCorrectOption={setIsCorrectOption}
      />
    );
  };

  const renderFooter = () => {
    return (
      <LevelsFooter
        operation={isCorrectOption ? ALL_CONSTANT.NEXT : ALL_CONSTANT.INFORMATION}
        nextText='Next'
        currentLevel={currentLevel}
        currentGamePosition={isCorrectOption ? currentGamePosition + 1 : currentGamePosition}
        isDisabled={!isOptionSelected}
      />
    );
  };

  if (!currentQuestion) {
    // Handle case when word is not found
    return <Loading/>;
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
