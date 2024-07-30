/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TFunction } from 'i18next';

import OptionBtn from '../Option';
import Bugsnag from '@bugsnag/js';

jest.mock('@bugsnag/js', () => ({
  __esModule: true,
  default: {
    start: jest.fn(),
    notify: jest.fn(),
  },
}));

jest.mock('../TextToSpeechBtn', () => {
  return {
    __esModule: true,
    default: () => <div>{'textToSpeech'}</div>,
  };
});

jest.mock('utils', () => ({
  addEndingPunctuation: jest.fn((text: string) => text),
}));

describe('OptionBtn', () => {
  beforeAll(() => {
    Bugsnag.start({ apiKey: 'YOUR_API_KEY' });
  });
  const mockSelector = jest.fn();
  const mockSetOptionSelected = jest.fn();
  const mockTextFunction: TFunction<'translation', undefined> = ((key: string) => key) as TFunction<
  'translation',
  undefined
  >;
  (mockTextFunction as any).$TFunctionBrand = true;
  const mockOption = {
    id: '1',
    word: 'Gurmukhi',
    option: 'Test option',
  };

  it('renders correctly with given option', async () => {
    await act(async () => {
      render(
        <OptionBtn
          option={mockOption}
          text={mockTextFunction}
          selector={mockSelector}
          setOptionSelected={mockSetOptionSelected}
          isCorrect={null}
          disabled={false}
        />,
      );
    });
    expect(screen.getByText('Gurmukhi')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('calls selector and setOptionSelected on button click', async () => {
    await act(async () => {
      render(
        <OptionBtn
          option={mockOption}
          text={mockTextFunction}
          selector={mockSelector}
          setOptionSelected={mockSetOptionSelected}
          isCorrect={null}
          disabled={false}
        />,
      );
    });
    fireEvent.click(screen.getByRole('button'));
    expect(mockSelector).toHaveBeenCalledWith(mockOption);
    expect(mockSetOptionSelected).toHaveBeenCalledWith(true);
  });

  it('displays correct styling when isCorrect is true', async () => {
    await act(async () => {
      render(
        <OptionBtn
          option={mockOption}
          text={mockTextFunction}
          selector={mockSelector}
          setOptionSelected={mockSetOptionSelected}
          isCorrect={true}
          disabled={false}
        />,
      );
    });
    expect(screen.getByRole('button').parentElement).toHaveClass('bg-lightGreen');
  });

  it('is disabled when the disabled prop is true', async () => {
    await act(async () => {
      render(
        <OptionBtn
          option={mockOption}
          text={mockTextFunction}
          selector={mockSelector}
          setOptionSelected={mockSetOptionSelected}
          isCorrect={null}
          disabled={true}
        />,
      );
    });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
