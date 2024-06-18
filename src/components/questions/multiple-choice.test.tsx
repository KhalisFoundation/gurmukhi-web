/**
 * @jest-environment jsdom
 */
import React from 'react';
import MultipleChoiceQuestion from './multiple-choice';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()), // mock dispatch as a function that returns a function
}));

jest.mock('auth', () => ({
  useUserAuth: jest.fn(() => ({ user: { uid: '123' } })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (key: string) => string } => ({
    t: (key: string): string => key, // Mock the translation function to return the key
  }),
}));

const questionData = {
  question: 'ਜਸਮੀਤ ਦੇ ਚੰਗੇ ਨੰਬਰ ਆਉਣ ਤੇ ਸਭ ਨੇ ਉਸਦੀ ___ ਕੀਤੀ ।',
  options: ['ਤਤ', 'ਉਸ', 'ਸਤਤ', 'ਉਸਤਤ'],
  answer: 3,
  word: 'capital',
  word_id: '7R6eKmbxBTAd75LOvqc5',
  id: 'q1',
};

const defaultProps = {
  questionData,
  hasImage: false,
  setOptionSelected: jest.fn(),
  setIsCorrectOption: jest.fn(),
  toggleLoading: jest.fn(),
};

const renderComponent = (props = {}) =>
  render(<MultipleChoiceQuestion {...defaultProps} {...props} />);

describe('MultipleChoiceQuestion Component', () => {
  test('renders the question and options correctly', () => {
    renderComponent();

    // Check if the question is displayed
    expect(screen.getByText('ਜਸਮੀਤ ਦੇ ਚੰਗੇ ਨੰਬਰ ਆਉਣ ਤੇ ਸਭ ਨੇ ਉਸਦੀ ___ ਕੀਤੀ ।')).toBeInTheDocument();

    // Check if all options are displayed
    questionData.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('handles option selection correctly', () => {
    renderComponent();
    const optionButton = screen.getByText('ਉਸਤਤ');
    fireEvent.click(optionButton);

    // Assuming setOptionSelected should be called with true
    expect(defaultProps.setOptionSelected).toHaveBeenCalledWith(true);

    // Optionally check for setIsCorrectOption
    expect(defaultProps.setIsCorrectOption).toHaveBeenCalledWith(true);
  });
});
