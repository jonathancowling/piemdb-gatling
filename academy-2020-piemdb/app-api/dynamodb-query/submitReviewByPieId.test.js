const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const uuid = require('uuid-random');
const { submitReviewByPieId } = require('./submitReviewByPieId');

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: process.env.REGION,
  }),
};

const ddb = new DocumentClient(config);

describe('Should correctly submit a review to the database', () => {
  it('Should insert a review into the table', async () => {
    // arrange
    const pieId = uuid();
    const reviewId = uuid();
    const reviewData = {
      uuid: pieId,
      'sort-key': `REVIEW-${reviewId}`,
      name: 'Ath',
      'review-text': 'Tasty',
      rating: '5',
      'date-posted': '2020-11-03',
    };
    // act
    await submitReviewByPieId(reviewData);
    const { Item } = await ddb.get({
      TableName: `PieMDB-database-${process.env.NODE_ENV}`,
      Key: {
        uuid: reviewData.uuid,
        'sort-key': reviewData['sort-key'],
      },
      ConsistentRead: true,
    }).promise();
    // assert
    expect(Item).toEqual(reviewData);
  });
});
