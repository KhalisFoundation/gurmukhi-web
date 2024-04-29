/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('navigates to dashboard when clicked', () => {
    render(<EndSessionButton className='' />);
    const endSessionButton = screen.getByRole('button');
    fireEvent.click(endSessionButton);
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('displays the back button with correct text and icon', () => {
    render(<EndSessionButton className='' />);
    expect(screen.getByText(CONSTANTS.END_SESSION)).toBeInTheDocument(); // Checks that the button text is rendered
  });
});
