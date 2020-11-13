module.exports = {
  tables: [
    {
      TableName: `PieMDB-database-${process.env.NODE_ENV}`,
      KeySchema: [
        {
          AttributeName: 'uuid',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sort-key',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'week-posted',
          AttributeType: 'S',
        },
        {
          AttributeName: 'uuid',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sort-key',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'find-by-week',
          KeySchema: [
            {
              AttributeName: 'week-posted',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'uuid',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    },
  ],
};
