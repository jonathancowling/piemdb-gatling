import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SubmitReview from './SubmitReview.jsx';
import { submitReviewAPI } from '../../api/submitReviewAPI';

const testReviews = [
  {
    name: 'Some review name',
    'review-text': 'This was a pretty good pie',
    rating: 5,
    'sort-key': 1,
  },
  {
    name: 'Some review ffesf4',
    'review-text': 'This was a pretty good pie!!!',
    rating: 4,
    'sort-key': 'REVIEW',
  },
];

// Arrange
const expectedData = {
  name: 'string',
  'review-text': 'this is a review',
  rating: 3,
  'sort-key': 'REVIEW',
};

jest.mock('../../api/submitReviewAPI');
submitReviewAPI.mockResolvedValue('nice mock');

describe('/pages/PiePage', () => {
  // captcha prevents this - need to fix later
  it.skip('Should submit a pie review when Submit Review is clicked', async () => {
    const setReviews = jest.fn();
    const setShowReviewForm = jest.fn();
    const history = createMemoryHistory();
    history.push('/pie-page/01');

    delete window.location;
    window.location = new URL('https://www.example.com/pie-page/01');

    // Act
    render(
    <Router history={history}>
      <SubmitReview
        setReviews={setReviews}
        reviews={testReviews}
        setShowForm={setShowReviewForm}
        setShowError={() => {}}
      />
    </Router>,
    );

    const nameElement = screen.getByTestId('name-input');
    const textElement = screen.getByTestId('text-input');
    const ratingElement = screen.getByText('3 Stars');
    userEvent.type(nameElement, expectedData.name);
    userEvent.type(textElement, expectedData['review-text']);
    userEvent.click(ratingElement);
    userEvent.click(screen.getByText('Submit Review'));

    // Assert
    expect(setReviews).toHaveBeenCalledWith([expectedData, ...testReviews]);
    expect(setShowReviewForm).toHaveBeenCalledWith(false);
    expect(submitReviewAPI).toHaveBeenCalledWith('01', expectedData);
  });
});
