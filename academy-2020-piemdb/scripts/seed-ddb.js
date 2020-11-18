/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// This script should populate the local dynamodb container with some pies

// Create AWS client
const AWS = require('aws-sdk');
const fs = require('fs');
const { pieData } = require('./pieData');

const stage = process.env.NODE_ENV;
if (stage === 'dev') {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'cpeahq',
    secretAccessKey: 'y1t6ot',
  });
} else if (stage === 'test') {
  AWS.config.update({
    region: 'eu-west-2',
  });
} else {
  throw new Error('NODE_ENV set incorrectly or just not set');
}
const dynamodb = new AWS.DynamoDB();

const batch = (batchSize) => (acc, cur) => {
  if (acc[acc.length - 1].length === batchSize) {
    acc.push([]);
  }
  acc[acc.length - 1].push(cur);
  return acc;
};

// Create table
fs.readFile('./PieMDB.json', 'utf-8', async (error, contents) => {
  if (error) {
    console.log(`Error reading file: ${error}`);
    throw new Error('Failed to read file');
  }
  const data = JSON.parse(contents);
  // console.log(`File contents: ${contents}`);
  const table = data.DataModel[0];

  table.TableName = `PieMDB-database-${stage}`;
  console.log(JSON.stringify(table));

  if (stage === 'dev') {
    const result = await dynamodb.createTable(table).promise().catch((err) => {
      console.log(err);
      throw err;
    });
    console.log(result);
  }

  // Create data
  const pies = pieData.Pies;
  const reviews = pieData.Reviews;

  // Put data in table
  const dynamodbDocumentClient = new AWS.DynamoDB.DocumentClient();

  const batchSize = 25;

  const batchedPies = pies.reduce(batch(batchSize), [[]]);

  const batchedReviews = reviews.reduce(batch(batchSize), [[]]);

  // write out pies
  for (let i = 0; i < batchedPies.length; i += 1) {
    const pieParams = {
      RequestItems: {
        [table.TableName]: batchedPies[i].map((pie) => ({
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
        [table.TableName]: batchedReviews[i].map((review) => ({
          PutRequest: {
            Item: review,
          },
        })),
      },
    };
    const reviewWriteResult = await dynamodbDocumentClient.batchWrite(reviewParams).promise();
    console.log(`review write result: ${JSON.stringify(reviewWriteResult)}`);
  }
});
