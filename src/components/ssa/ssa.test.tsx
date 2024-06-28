/**
 * @jest-environment jsdom
 */
import React from 'react';
import Ssa from 'components/ssa';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: (): { t: (key: string) => string } => ({
    t: (key: string): string => key, // Mock the translation function to return the key
  }),
}));
describe('Ssa component', () => {
  test('renders SSA greeting with user name', () => {
    render(<Ssa name='Amitoj' />);

    const greeting = screen.getByText(/Amitoj/);
    expect(greeting).toBeInTheDocument();
    expect(greeting.closest('a')).toHaveAttribute('href', '/profile'); // Assuming '/profile' is the ROUTES.PROFILE
  });
});
