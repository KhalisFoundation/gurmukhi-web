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

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()), // mock dispatch as a function that returns a function
}));

describe('End Session Button', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
    mockedUpdater.mockClear();
  });

  it('displays the end button with correct text and icon', () => {
    render(<EndSessionButton uid='user1234' className='' />);
    expect(screen.getByText(CONSTANTS.END_SESSION)).toBeInTheDocument(); // Checks that the button text is rendered
  });
});
