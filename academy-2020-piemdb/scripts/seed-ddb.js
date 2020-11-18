/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// This script should populate the local dynamodb container with some pies

// Create AWS client
const AWS = require('aws-sdk');
const { pieData } = require('./pieData');

const stage = process.env.NODE_ENV;
if (stage === 'dev') {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'any-string',
    secretAccessKey: 'any-other-string',
  });
} else if (stage === 'test') {
  AWS.config.update({
    region: 'eu-west-2',
  });
} else {
  throw new Error('NODE_ENV must be set to dev or test');
}

const batch = (batchSize) => (acc, cur) => {
  if (acc[acc.length - 1].length === batchSize) {
    acc.push([]);
  }
  acc[acc.length - 1].push(cur);
  return acc;
};

const writeToTable = async (table, batchSize) => {
  // Create data
  const pies = pieData.Pies;
  const reviews = pieData.Reviews;

  // Put data in table
  const dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient();

  const batchedPies = pies.reduce(batch(batchSize), [[]]);

  const batchedReviews = reviews.reduce(batch(batchSize), [[]]);

  // write out pies
  for (let i = 0; i < batchedPies.length; i += 1) {
    const pieParams = {
      RequestItems: {
        [table]: batchedPies[i].map((pie) => ({
          PutRequest: {
            Item: pie,
          },
        })),
      },
    };
    const pieWriteResult = await dynamodbDocumentClient.batchWrite(pieParams).promise();
    console.log(`pie write result: ${JSON.stringify(pieWriteResult)}`);
  }
  // write out reviews
  for (let i = 0; i < batchedReviews.length; i += 1) {
    const reviewParams = {
      RequestItems: {
        [table]: batchedReviews[i].map((review) => ({
          PutRequest: {
            Item: review,
          },
        })),
      },
    };
    const reviewWriteResult = await dynamodbDocumentClient.batchWrite(reviewParams).promise();
    console.log(`review write result: ${JSON.stringify(reviewWriteResult)}`);
  }
};

writeToTable(`PieMDB-database-${process.env.NODE_ENV}`, 25)
  .then(() => console.log('Table has been seeded'))
  .catch((err) => console.log(err));
