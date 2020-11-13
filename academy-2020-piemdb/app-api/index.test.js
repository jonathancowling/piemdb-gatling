const request = require('supertest');
const uuid = require('uuid-random');
const { getPieById } = require('./dynamodb-query/getPieById');
const { getRandomPieLE } = require('./dynamodb-query/getRandomPieLE');
const { getRandomPieGT } = require('./dynamodb-query/getRandomPieGT');
const { fakeSearchIndex } = require('./fakeSearchIndex');

jest.doMock('fs', () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue(JSON.stringify(fakeSearchIndex)),
  },
}));
const { app } = require('./index');
const { submitReviewByPieId } = require('./dynamodb-query/submitReviewByPieId');
const { getReviewsById } = require('./dynamodb-query/getReviewsById');

const pieData = {
  image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/steakandkidneypie_73308_16x9.jpg',
  'date-posted': '2020-10-12',
  'week-posted': '2020-10-12',
  name: 'Steak and Kidney',
  description: 'A reyt gud pie',
  location: 'Leeds',
  'sort-key': 'PIE',
  uuid: '02',
};

jest.mock('./dynamodb-query/getPieById');
getPieById.mockResolvedValueOnce(pieData);

afterEach(() => {
  jest.restoreAllMocks();
});

describe('/pie/:id', () => {
  it('when getPie is called with an id it returns the correct pie', async () => {
    await request(app)
      .get('/pie/02')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, JSON.stringify(pieData))
      .then(() => expect(getPieById).toHaveBeenCalledTimes(1));
  });
});

const pieIdLE = {
  uuid: 'a1ef63f7-db69-45b4-aae2-6cf77319cf11',
};
jest.mock('./dynamodb-query/getRandomPieLE');
getRandomPieLE.mockResolvedValueOnce(pieIdLE);

describe('/randomPie', () => {
  it('When a random pie button is clicked it returns a valid random pie id with LE', async () => {
    await request(app)
      .get('/randomPie')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, JSON.stringify(pieIdLE.uuid))
      .then(() => expect(getRandomPieLE).toHaveBeenCalledTimes(1));
  });
});

const pieIdGT = {
  uuid: '05653d08-8705-4c28-8254-f5166811f18c',
};
jest.mock('./dynamodb-query/getRandomPieGT');
getRandomPieGT.mockResolvedValueOnce(pieIdGT);
describe('/randomPie', () => {
  it('When a random pie button is clicked it returns a valid random pie id with GT', async () => {
    await request(app)
      .get('/randomPie')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, JSON.stringify(pieIdGT.uuid))
      .then(() => expect(getRandomPieGT).toHaveBeenCalledTimes(1));
  });
});

describe('/search', () => {
  it('Returns the ids matched by lunr', async () => {
    await request(app)
      .get('/search/Leeds%20York')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, ['646b5325-a0e1-4e00-8cb1-bbf320953ac1', '7fd6cd0a-7692-4ce1-81d2-beeaa7ee011f']);
    jest.restoreAllMocks();
  });
});

const expectedReviews = [
  {
    uuid: 'test-uuid-1',
    name: 'Connor',
    'review-text': 'Great Pie',
    rating: 5,
    'date-posted': '2020-11-03',
    'sort-key': 'REVIEW-test-uuid',
  },
  {
    uuid: 'test-uuid-1',
    name: 'Ath',
    'review-text': 'Bad Pie',
    rating: 1.5,
    'date-posted': '2020-11-04',
    'sort-key': 'REVIEW-test-uuid',
  },
];
jest.mock('./dynamodb-query/getReviewsById');
getReviewsById.mockResolvedValue(expectedReviews);
describe('/review/:id', () => {
  it('Should return all reviews for a valid pie id', async () => {
    await request(app)
      .get(`/review/${expectedReviews[0].uuid}`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, JSON.stringify(expectedReviews))
      .then(() => expect(getReviewsById).toHaveBeenCalledTimes(1))
      .then(() => expect(getReviewsById).toHaveBeenCalledWith(expectedReviews[0].uuid));
  });
  it.todo('/review/:id should return a 400 error when a non existent pieId is accessed');
});

jest.mock('./dynamodb-query/submitReviewByPieId');
submitReviewByPieId.mockResolvedValue('done');
jest.mock('uuid-random');
uuid.mockReturnValue('test-uuid');
describe('/review', () => {
  it('Should submit a review when valid inputs are provided', async () => {
    const reviewData = {
      name: 'Connor',
      'review-text': 'Great Pie',
      rating: 5,
    };
    // generate the current date
    const dateTime = new Date();
    const date = JSON.stringify(dateTime).substring(1, 11);
    await request(app)
      .put('/review')
      .send({ review: reviewData, token: 'test' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then(() => {
        reviewData['date-posted'] = date;
        reviewData['sort-key'] = 'REVIEW-test-uuid';
        expect(submitReviewByPieId).toHaveBeenCalledWith(reviewData);
      })
      .then(() => expect(submitReviewByPieId).toHaveBeenCalledTimes(1));
  });

  it('Should return a 400 error and the correct error for invalid review', async (done) => {
    const reviewData = {
      name: 'Connor',
      'review-text': '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      + '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      + '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      + '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      + '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      + '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
      rating: 5,
    };

    await request(app)
      .put('/review')
      .send({ review: reviewData, token: 'test' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect('"invalid review, please check length of name and review"');
    done();
  });

  it('Should return a 400 error and the correct error for invalid name', async (done) => {
    const reviewData = {
      name: '012345678901234567890123456789',
      'review-text': 'nice pie',
      rating: 5,
    };

    await request(app)
      .put('/review')
      .send({ review: reviewData, token: 'test' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect('"invalid review, please check length of name and review"');
    done();
  });
});
