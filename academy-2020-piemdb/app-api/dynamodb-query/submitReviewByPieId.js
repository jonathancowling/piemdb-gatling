const { executePutItem, createDynamoDbClient } = require('./dynamoBoilerplate');

const createPutItemInput = (review) => ({
  TableName: `PieMDB-database-${process.env.NODE_ENV}`,
  Item: review,
});

const submitReviewByPieId = async (review) => {
  // Create the DynamoDB Client with the region you want
  // const dynamoDbClient = createDynamoDbClient();
  const dynamoDbClient = createDynamoDbClient();
  // Create the input for query call
  const queryInput = createPutItemInput(review);
  // Call DynamoDB's query API
  const queryResult = await executePutItem(dynamoDbClient, queryInput);
  return queryResult;
};

module.exports = {
  submitReviewByPieId,
  createPutItemInput,
};
