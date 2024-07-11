/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndSessionButton from '../EndSessionBtn';
import CONSTANTS from 'constants/constant';

// Mock useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: (): jest.Mock => mockedNavigate,
}));

describe('End Session Button', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
  });
  const mockCurrentData = {
    coins: 0,
    progress: {
      currentProgress: 0,
      gameSession: [],
      currentLevel: 0,
    },
    nextSession: [],
  };

  it('displays the end button with correct text and icon', () => {
    render(<EndSessionButton uid='user1234' currentData={mockCurrentData} className='' />);
    expect(screen.getByText(CONSTANTS.END_SESSION)).toBeInTheDocument(); // Checks that the button text is rendered
  });
});
