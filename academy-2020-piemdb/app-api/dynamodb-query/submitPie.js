const { executePutItem, createDynamoDbClient } = require('./dynamoBoilerplate');

const createPutItemInput = (pieData) => ({
  TableName: `PieMDB-database-${process.env.NODE_ENV}`,
  Item: pieData,
});

const submitPie = async (pieData) => {
  // Create the DynamoDB Client with the region you want
  // const dynamoDbClient = createDynamoDbClient();
  const dynamoDbClient = createDynamoDbClient();
  // Create the input for query call
  const queryInput = createPutItemInput(pieData);
  // Call DynamoDB's query API
  const queryResult = await executePutItem(dynamoDbClient, queryInput);
  return queryResult;
};

module.exports = {
  submitPie,
  createPutItemInput,
};
