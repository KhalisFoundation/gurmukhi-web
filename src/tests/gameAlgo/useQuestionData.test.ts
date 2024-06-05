/**
 * @jest-environment jsdom
 */
/* eslint-disable no-magic-numbers */
import { renderHook } from '@testing-library/react';
import useQuestionData from 'pages/questions/hooks/useQuestionData';
import { QuestionData } from 'types';

const currentQuestion: QuestionData = {
  id: '1',
  options: ['option1', 'option2', 'option3'],
  answer: 1,
  word: 'word',
  word_id: 'word_id',
  question: 'question',
};

describe('useQuestionData', () => {
  afterEach(() => {
    jest.clearAllMocks();
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

  it('should shuffle options and check the answers if matches', () => {
    const { result } = renderHook(() => useQuestionData(currentQuestion));
    expect(result.current.options[result.current.answer]).toEqual(
      currentQuestion.options[currentQuestion.answer],
    );
  });
});
