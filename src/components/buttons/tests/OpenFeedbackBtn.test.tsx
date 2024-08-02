/**
 * @jest-environment jsdom
 */
import React, { PropsWithChildren } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackBtn from '../OpenFeedbackBtn';

// Mocking the FeedbackForm component
jest.mock('components/feedback', () => {
  const MockFeedbackForm = () => <div data-testid='mock-feedback-form'>Feedback Form</div>;
  MockFeedbackForm.displayName = 'MockFeedbackForm'; // Setting the displayName
  return MockFeedbackForm;
});

// Mocking the imported components
jest.mock('components/modal', () => {
  const MockModal = ({ children }: PropsWithChildren) => (
    <div data-testid='mock-modal'>{children}</div>
  );
  MockModal.displayName = 'MockModal';
  return MockModal;
});

describe('FeedbackBtn', () => {
  it('renders the button and toggles the modal on click', () => {
    render(<FeedbackBtn />);
    const feedbackButton = screen.getByText('Submit Feedback!');
    expect(feedbackButton).toBeInTheDocument();

    // Modal should not be visible initially
    expect(screen.queryByTestId('mock-modal')).toBeNull();

    // Click the button to open the modal
    fireEvent.click(feedbackButton);
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByTestId('mock-feedback-form')).toBeInTheDocument();

    // Click the button again to close the modal
    fireEvent.click(feedbackButton);
    expect(screen.queryByTestId('mock-modal')).toBeNull();
  });
});
