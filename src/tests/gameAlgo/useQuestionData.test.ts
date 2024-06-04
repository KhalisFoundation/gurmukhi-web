/**
 * @jest-environment jsdom
 */
/* eslint-disable no-magic-numbers */
import { renderHook } from '@testing-library/react';
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
jest.mock('pages/dashboard/utils', () => ({
  shuffleArray: jest.fn((array) => [...array]),
}));

const currentQuestion: QuestionData = {
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

  it('should return the same data if no options are provided', () => {
    const question: QuestionData = {
      id: '1',
      options: ['option1', 'option2', 'option3'],
      answer: 0,
      word: 'word',
      word_id: 'word_id',
      question: 'question',
    } as QuestionData;
    const { result } = renderHook(() => useQuestionData(question));
    expect(result.current).toEqual(question);
  });

  it('should correctly process question data', () => {
    const { result } = renderHook(() => useQuestionData(currentQuestion));
    expect(result.current).toHaveProperty('id', '1');
    expect(result.current).toHaveProperty('word', 'word');
    expect(result.current).toHaveProperty('word_id', 'word_id');
    expect(result.current).toHaveProperty('question', 'question');
  });

  it('should shuffle options and return all the options', () => {
    const { result } = renderHook(() => useQuestionData(currentQuestion));
    expect(result.current.options.length).toEqual(currentQuestion.options.length);
  });
});
