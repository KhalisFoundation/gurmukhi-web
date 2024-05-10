import React from 'react';
import useQuestionData from 'pages/questions/hooks/useQuestionData';
import { QuestionData } from 'types';

// QuestionData
//   id?: string;
//   question: string;
//   translation?: string;
//   image?: string;
//   type?: string;
//   options: Option[] | string[];
//   answer: number;
//   word_id: string;
//   word: string;

// Mocking useMemo hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((obj) => obj),
}));

const currentQuestion = {
  id: '1',
  options: ['option1', 'option2', 'option3'],
  answer: 1,
  word: 'word',
  word_id: 'word_id',
  question: 'question',
} as QuestionData;

describe('useQuestionData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly process question data', () => {
    const questionData = useQuestionData(currentQuestion);
    console.log('Question Data: ', questionData);
    expect(questionData).toHaveProperty('id', '1');
    expect(questionData).toHaveProperty('word', 'word');
    expect(questionData).toHaveProperty('word_id', 'word_id');
    expect(questionData).toHaveProperty('question', 'question');
  });

  it('should randomly shuffle options', () => {
    const questionData = useQuestionData(currentQuestion);
    expect(questionData.options).not.toEqual(currentQuestion.options);
  });
});
