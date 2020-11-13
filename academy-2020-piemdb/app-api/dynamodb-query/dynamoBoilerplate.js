/* eslint-disable no-console */

// this allows it to be in dev dependancies - it is already in aws
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const envVarChecker = require('../envVarChecker');

const createDynamoDbClient = () => {
  // Throw an error if NODE_ENV is set incorrectly
  envVarChecker();
  const awsEndpoint = process.env.ENDPOINT;
  const awsRegion = process.env.REGION;
  const stage = process.env.NODE_ENV;
  if (stage === 'prod') {
    // Set the region for real dynamodb
    AWS.config.update({
      endpoint: awsEndpoint,
      region: awsRegion,
    });
  } else if (stage === 'dev') {
    // Default to dev if env is provided but not prod
    AWS.config.update({
      region: awsRegion, endpoint: awsEndpoint, accessKeyId: 'access_key_id', secretAccessKey: 'secret_access_key',
    });
  } else if (stage === 'test') {
    const config = {
      endpoint: awsEndpoint,
      sslEnabled: false,
      region: awsRegion,
    };
    AWS.config.update(config);
  }
  return new AWS.DynamoDB.DocumentClient();
};

const handleCommonErrors = async (err) => {
  switch (err.code) {
    case 'InternalServerError':
      console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;
    case 'ProvisionedThroughputExceededException':
      console.error('Request rate is too high. If you\'re using a custom retry strategy make sure to retry with exponential back-off.'
        + `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
      return;
    case 'ResourceNotFoundException':
      console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
      return;
    case 'ServiceUnavailable':
      console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;
    case 'ThrottlingException':
      console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
      return;
    case 'UnrecognizedClientException':
      console.error('The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.'
        + `Error: ${err.message}`);
      return;
    case 'ValidationException':
      console.error('The input fails to satisfy the constraints specified by DynamoDB, '
        + `fix input before retrying. Error: ${err.message}`);
      return;
    case 'RequestLimitExceeded':
      console.error('Throughput exceeds the current throughput limit for your account, '
        + `increase account level throughput before retrying. Error: ${err.message}`);
      return;
    default:
      console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
  }
};

const handlePutItemError = (err) => {
  if (!err) {
    console.error('Encountered error object was empty');
    return;
  }
  if (!err.code) {
    console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
    return;
  }
  switch (err.code) {
    case 'ConditionalCheckFailedException':
      console.error(`Condition check specified in the operation failed, review and update the condition check before retrying. Error: ${err.message}`);
      return;
    case 'TransactionConflictException':
      console.error(`Operation was rejected because there is an ongoing transaction for the item, generally safe to retry ' +
       'with exponential back-off. Error: ${err.message}`);
      return;
    case 'ItemCollectionSizeLimitExceededException':
      console.error(`An item collection is too large, you're using Local Secondary Index and exceeded size limit of 
        items per partition key. Consider using Global Secondary Index instead. Error: ${err.message}`);
      return;
    default:
      break;
    // Common DynamoDB API errors are handled below
  }
  handleCommonErrors(err);
};

// Handles errors during Query execution. Use recommendations in error messages below to
// add error handling specific to your application use-case.
const handleQueryError = async (err) => {
  if (!err) {
    console.error('Encountered error object was empty');
    return;
  }
  if (!err.code) {
    console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
    return;
  }
  // here are no API specific errors to handle for Query,
  // common DynamoDB API errors are handled below
  handleCommonErrors(err);
};

const executePutItem = async (dynamoDbClient, putItemInput) => {
  // Call DynamoDB's putItem API
  const putItemOutput = await dynamoDbClient.put(putItemInput)
    .promise()
    .catch((err) => handlePutItemError(err));
  return putItemOutput;
};

const executeQuery = async (dynamoDbClient, queryInput) => {
  // Call DynamoDB's query API
  try {
    const queryOutput = await dynamoDbClient.query(queryInput).promise();
    // Handle queryOutput
    return queryOutput;
  } catch (err) {
    const result = handleQueryError(err);
    return result;
  }
};

module.exports = {
  createDynamoDbClient,
  executeQuery,
  executePutItem,
};
