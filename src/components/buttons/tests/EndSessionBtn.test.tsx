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

const mockedUpdater = jest.fn(async () => Promise.resolve());
// Mock updateUserDocument function
jest.mock('database/shabadavalidb', () => ({
  updateUserDocument: (): jest.Mock => mockedUpdater,
}));


describe('End Session Button', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
    mockedUpdater.mockClear();
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

  // it('navigates to dashboard when clicked', () => {
  //   render(<EndSessionButton uid='user1234' currentData={mockCurrentData} className='' />);
  //   const endSessionButton = screen.getByRole('button');
  //   fireEvent.click(endSessionButton);
  //   expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  // });

  // it('calls updateUserDocument with correct arguments', () => {
  //   render(<EndSessionButton uid='user1234' currentData={mockCurrentData} className='' />);
  //   const endSessionButton = screen.getByRole('button');
  //   fireEvent.click(endSessionButton);
  //   expect(mockedUpdater).toHaveBeenCalledWith('user1234', mockCurrentData);
  // });

  it('displays the end button with correct text and icon', () => {
    render(<EndSessionButton uid='user1234' currentData={mockCurrentData} className='' />);
    expect(screen.getByText(CONSTANTS.END_SESSION)).toBeInTheDocument(); // Checks that the button text is rendered
  });
});
