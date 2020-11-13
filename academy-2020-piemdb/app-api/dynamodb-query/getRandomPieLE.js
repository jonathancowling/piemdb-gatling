const { createDynamoDbClient, executeQuery } = require('./dynamoBoilerplate');

const createQueryInput = (week, uuid) => ({
  TableName: `PieMDB-database-${process.env.NODE_ENV}`,
  ScanIndexForward: false,
  ConsistentRead: false,
  IndexName: 'find-by-week',
  KeyConditionExpression: '#fdec0 = :fdec0 And #fdec1 <= :fdec1',
  Limit: '1',
  ExpressionAttributeValues: {
    ':fdec0': week,
    ':fdec1': uuid,
  },
  ExpressionAttributeNames: {
    '#fdec0': 'week-posted',
    '#fdec1': 'uuid',
  },
});

const getRandomPieLE = async (week, uuid) => {
  // Create the DynamoDB Client with the region you want
  const dynamoDbClient = createDynamoDbClient();
  // Create the input for query call
  const queryInput = createQueryInput(week, uuid);
  // Call DynamoDB's query API
  const queryResult = await executeQuery(dynamoDbClient, queryInput).catch((error) => {
    console.log(`Error in query: ${error}`);
  });
  return (queryResult.Items[0]);
};

module.exports = {
  getRandomPieLE,
};
