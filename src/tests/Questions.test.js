import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Questions from './Questions';
import Header from 'components/header/Header'; // Import the Header component

// Mock the Header component since we only want to test Questions in isolation
jest.mock('components/header/Header', () => () => <div data-testid="mocked-header" />);

describe('Questions Component', () => {
  it('renders without errors', () => {
    const { getByText } = render(<Questions />);
    const questionsText = getByText('Questions');
    expect(questionsText).toBeInTheDocument();
  });

  it('renders the Header component', () => {
    const { getByTestId } = render(<Questions />);
    const header = getByTestId('mocked-header');
    expect(header).toBeInTheDocument();
  });

  it('applies the expected CSS classes', () => {
    const { container } = render(<Questions />);
    const mainElement = container.firstChild;
    const sectionElement = container.querySelector('section');

    expect(mainElement).toHaveClass('flex min-h-screen flex-col justify-between background-layer');
    expect(sectionElement).toHaveClass('flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute');
  });
});
