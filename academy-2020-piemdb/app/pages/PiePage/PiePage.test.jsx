import React from 'react';
import fetchMock from 'jest-fetch-mock';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import useGetPie from '../../hooks/useGetPie';
import '@testing-library/jest-dom';
import PiePage from './PiePage.jsx';

fetchMock.enableMocks();

beforeEach(() => fetch.mockResponseOnce('[]'));

afterEach(() => {
  cleanup();
  fetch.resetMocks();
});

jest.mock('../../hooks/useGetPie');
useGetPie.mockReturnValue({
  uuid: '01',
  name: 'Steak and Kidney',
  location: 'Sheffield',
  'date-posted': '02/10/2020',
  description: 'A reyt gud pie',
  image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/steakandkidneypie_73308_16x9.jpg',
});

describe('/pages/PiePage', () => {
  it('Should not show a review form when pie page is loaded', async () => {
    const history = createMemoryHistory();
    history.push('/pie-page/01');
    await act(async () => {
      render(
      <Router history={history}>
        <PiePage />
      </Router>,
      );
    });
    const testID = screen.queryByTestId('submit-review-form');
    expect(testID).toBeFalsy();
  });

  it('Should show a review form when show review is clicked', async () => {
    const history = createMemoryHistory();
    history.push('/pie-page/01');

    await act(async () => {
      render(
        <Router history={history}>
          <PiePage />
        </Router>,
      );
    });
    fireEvent.click(screen.getByText('Create a review'));
    const testID = screen.queryByTestId('submit-review-form');
    expect(testID).toBeTruthy();
  });
});
