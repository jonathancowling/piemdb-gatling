const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const uuid = require('uuid-random');
const { getReviewsById } = require('./getReviewsById');

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: process.env.REGION,
  }),
};

const tableName = `${process.env.TABLE_NAME}`;

const ddb = new DocumentClient(config);

describe('Should correctly receive a set of reviews from the database when a pie id is given', () => {
  it('Should get the appropriate reviews back', async () => {
    // arrange
    const pieId = uuid();
    const pieId2 = uuid();

    const expectedReviewData = [
      {
        uuid: pieId,
        'sort-key': `REVIEW-${uuid()}`,
        name: 'Ath',
        'review-text': 'Tasty',
        rating: '5',
        'date-posted': '2020-11-03',
      },
      {
        uuid: pieId,
        'sort-key': `REVIEW-${uuid()}`,
        name: 'Connor',
        'review-text': 'Bad',
        rating: '1',
        'date-posted': '2020-11-05',
      },
    ];
    const allData = [
      {
        uuid: pieId2,
        'sort-key': `REVIEW-${uuid()}`,
        name: 'Mike',
        'review-text': 'Okay',
        rating: '3',
        'date-posted': '2020-11-04',
      },
      expectedReviewData[0],
      expectedReviewData[1],
    ];
    // act
    await ddb
      .put({
        TableName: tableName,
        Item: allData[0],
      })
      .promise();
    await ddb
      .put({
        TableName: tableName,
        Item: allData[1],
      })
      .promise();
    await ddb
      .put({
        TableName: tableName,
        Item: allData[2],
      })
      .promise();

    const actualOutput = await getReviewsById(pieId);
    // assert
    expect(actualOutput.length).toBe(2);
    expect(actualOutput).toEqual(
      expect.arrayContaining([
        expect.objectContaining(expectedReviewData[0]),
        expect.objectContaining(expectedReviewData[1]),
      ]),
    );
  });

  it('Should not get a review if none exist', async () => {
    // arrange
    const data = {
      uuid: uuid(),
      'sort-key': `REVIEW-${uuid()}`,
      name: 'Ath',
      'review-text': 'Tasty',
      rating: '5',
      'date-posted': '2020-11-03',
    };
    // act
    await ddb
      .put({
        TableName: tableName,
        Item: data,
      })
      .promise();

    const actualOutput = await getReviewsById('*inhales* wwwrrrroooonnng');
    // assert
    expect(actualOutput.length).toBe(0);
    expect(actualOutput).toEqual([]);
  });
});
