const fs = require('fs').promises;
const lunr = require('lunr');
require('dotenv').config();
const AWS = require('aws-sdk');

module.exports.handle = async () => {
  const stage = process.env.NODE_ENV;
  const awsRegion = process.env.REGION;
  const awsEndpoint = process.env.ENDPOINT;
  if (stage === 'prod' || stage === 'test') {
    // Set the region for real dynamodb
    AWS.config.update({
      region: awsRegion,
      endpint: awsEndpoint,
    });
  } else if (stage === 'dev') {
    // Default to dev if env is provided but not prod
    AWS.config.update({
      region: awsRegion,
      endpoint: awsEndpoint,
    });
  }
  // Get data from dynamodb
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: `PieMDB-database-${stage}`,
  };
  const records = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const result = await dynamodb.scan(params).promise();
    records.push(...result.Items);
    if (typeof result.LastEvaluatedKey !== 'undefined') {
      console.info('Scanning for more records');
      params.ExclusiveStartKey = result.LastEvaluatedKey;
    } else {
      break;
    }
  }
  console.info(`Records retrieved: ${records.length}`);

  // Build the index
  // eslint-disable-next-line func-names
  const idx = lunr(function () {
    this.ref('uuid');
    this.field('name');
    this.field('description');
    this.field('location');

    records.forEach((record) => {
      if (record['sort-key'] === 'PIE') {
        this.add(record);
      }
    });
  });

  // Write index out
  const data = JSON.stringify(idx);
  if (stage === 'prod') {
    const s3 = new AWS.S3();
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'index.json',
      Body: data,
    };
    const result = await s3.upload(s3Params).promise();
    console.log(`File uploaded successfully. ${result.Location}`);
  } else if (stage === 'dev') {
    await fs.writeFile('index.json', data);
  }
  return {};
};
