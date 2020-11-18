/* eslint-disable no-console */

//------------------------------------------------------------
// This script should only be used for running in dev mode
//------------------------------------------------------------

// Create AWS client
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'any-string',
  secretAccessKey: 'any-other-string',
});

const dynamodb = new AWS.DynamoDB();
fs.readFile('./PieMDB.json', 'utf-8', async (error, contents) => {
  if (error) {
    console.log(`Error reading file: ${error}`);
    throw new Error('Failed to read file');
  }
  const data = JSON.parse(contents);
  const table = data.DataModel[0];

  table.TableName = `PieMDB-database-${process.env.NODE_ENV}`;
  console.log(JSON.stringify(table));

  const result = await dynamodb.createTable(table).promise().catch((err) => {
    console.log(err);
    throw err;
  });
  console.log(result);
});
