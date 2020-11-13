const fs = require('fs');
const lunr = require('lunr');
const mockFs = require('mock-fs');

describe('Index build test', () => {
  // We mock 2 calls to scan as DDB will only return 1MB of data so this indexer should iterate
  // Record '1235' should not be included in the index
  beforeAll(async () => {
    const ddbMock = jest.fn().mockResolvedValueOnce({
      Items: [{
        uuid: '1234',
        name: 'Thing 1',
        description: 'Description of a thing',
        location: 'Leeds',
        'sort-key': 'PIE',
      },
      {
        uuid: '1235',
        name: 'Thing 2',
        description: 'Cat',
        location: 'Place',
        'sort-key': 'NOT PIE',
      }],
      LastEvaluatedKey: '1235',
    }).mockResolvedValueOnce({
      Items: [{
        uuid: '1236',
        name: 'Thing 3',
        description: 'This is a fish pie',
        location: 'Sheffield',
        'sort-key': 'PIE',
      }],
    });
    jest.doMock('aws-sdk', () => ({
      DynamoDB: {
        DocumentClient: jest.fn(() => ({
          scan: () => ({
            promise: ddbMock,
          }),
        })),
      },
      config: {
        update: jest.fn(),
      },
    }));
    mockFs({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockFs.restore();
  });

  it('Check we can build a valid index', async () => {
    // Act
    // eslint-disable-next-line global-require
    const { handle } = mockFs.bypass(() => require('./handler'));
    await handle();
    // Assert
    const indexData = await fs.promises.readFile('./index.json');
    const idx = lunr.Index.load(JSON.parse(indexData));
    const locationResults = idx.search('Leeds');
    expect(locationResults.length).toStrictEqual(1);
    expect(locationResults[0].ref).toBe('1234');
    const descriptionResults = idx.search('fish');
    expect(descriptionResults.length).toStrictEqual(1);
    expect(descriptionResults[0].ref).toBe('1236');
    const excludedRecord = idx.search('Place');
    expect(excludedRecord.length).toStrictEqual(0);
  });
});
