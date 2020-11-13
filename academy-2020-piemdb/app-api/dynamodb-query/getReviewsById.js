const { createDynamoDbClient, executeQuery } = require('./dynamoBoilerplate');

const createQueryInput = (id) => ({
  TableName: `PieMDB-database-${process.env.NODE_ENV}`,
  ScanIndexForward: false,
  ConsistentRead: false,
  KeyConditionExpression: '#50b30 = :50b30 And begins_with(#50b31, :50b31)',
  ExpressionAttributeValues: {
    ':50b30': id,
    ':50b31': 'REVIEW',
  },
  ExpressionAttributeNames: {
    '#50b30': 'uuid',
    '#50b31': 'sort-key',
  },
});

const getReviewsById = async (id) => {
  // Create the DynamoDB Client with the region you want
  const dynamoDbClient = createDynamoDbClient();
  // Create the input for query call
  const queryInput = createQueryInput(id);
  // Call DynamoDB's query API
  const queryResult = await executeQuery(dynamoDbClient, queryInput);
  return (queryResult).Items;
};

module.exports = {
  getReviewsById,
};
