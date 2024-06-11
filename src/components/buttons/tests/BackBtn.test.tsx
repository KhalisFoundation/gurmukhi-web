/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackBtn from '../BackBtn';

// Mock the Font Awesome icon component and hooks
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

// Mock the react-i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (key: string) => string } => ({
    t: (key: string): string => key, // Mock the translation function to return the key
  }),
}));

// Mock useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: (): jest.Mock => mockedNavigate,
}));

describe('BackBtn', () => {
  afterEach(() => {
    mockedNavigate.mockClear();
  });

  it('navigates to the dashboard when no navlink is provided', () => {
    render(<BackBtn />);
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard'); // Assuming '/dashboard' is the ROUTES.DASHBOARD value
  });

  it('navigates to the provided navlink', () => {
    const navlink = -1; // Example navlink, assuming the type to be number if different adjust accordingly
    render(<BackBtn navlink={navlink} />);
    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith(navlink);
  });

  it('displays the back button with correct text and icon', () => {
    render(<BackBtn />);
    expect(screen.getByText('BACK')).toBeInTheDocument(); // Checks that the button text is rendered
    expect(screen.getByText('Icon')).toBeInTheDocument(); // Checks that the icon is rendered
  });
});
