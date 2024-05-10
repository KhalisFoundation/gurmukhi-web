import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QuestionData } from 'types';
import Meta from 'components/meta';
import metaTags from 'constants/meta';
import { getQuestionByID } from 'database/default/question';
import { useAppSelector } from 'store/hooks';
import Loading from 'components/loading';
import useQuestionData from './hooks/useQuestionData';
import { getQuestionElement, renderFooter } from './utils';

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
      const question: QuestionData | undefined = await getQuestionByID(questionID);
      if (question) {
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

  const questionData = useQuestionData(currentQuestion);
  const questionElement = getQuestionElement(questionData, currentQuestion, setIsCorrectOption, setIsOptionSelected);
  const footerElement = renderFooter(currentLevel, currentGamePosition, isCorrectOption, isOptionSelected);

  if (!currentQuestion) {
    // Handle case when word is not found
    return <Loading/>;
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <Meta title={title} description={description} />
      <div className='flex-1 flex-col'>
        <div className='flex flex-col items-center h-full justify-between w-5/6 lg:w-1/2 m-auto'>
          <img
            className='w-1/3 h-6'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
          {questionElement}
          <img
            className='w-1/3 h-6 rotate-180'
            src='/icons/pointy_border.svg'
            alt='border-top'
            width={200}
            height={200}
          />
        </div>
      </div>
      {footerElement}
    </div>
  );
}
