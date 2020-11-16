const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const uuid = require('uuid-random');
const { submitPie } = require('./submitPie');
const { getFirstDayOfWeek } = require('../randomDateGenerator');

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: process.env.REGION,
  }),
};

const ddb = new DocumentClient(config);

describe('Should correctly submit a pie to the database', () => {
  it('Should insert a pie into the table', async () => {
    // arrange
    const randomUUID = uuid();
    // Remove time component from today's date
    const today = new Date();
    const submittedDate = new Date(Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(), 0, 0, 0, 0,
    ));
    const image = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F530932243546261067%2F&psig=AOvVaw2tv9EdQUC5ESU6pZ80wMQr&ust=1604660103584000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLiNy-2e6-wCFQAAAAAdAAAAABAD';
    const pieData = {
      name: 'a pie',
      description: 'nice pie',
      location: 'restaurant',
      cost: '£50.00',
    };
    pieData.uuid = randomUUID;
    pieData.image = image;
    pieData['date-posted'] = JSON.stringify(submittedDate).substring(1, 11);
    pieData['week-posted'] = JSON.stringify(getFirstDayOfWeek(submittedDate)).substring(1, 11);
    pieData['sort-key'] = 'PIE';
    await submitPie(pieData);
    // act
    const { Item } = await ddb.get({
      TableName: `${process.env.TABLE_NAME}`,
      Key: {
        uuid: randomUUID,
        'sort-key': 'PIE',
      },
      ConsistentRead: true,
    }).promise();
    // assert
    expect(Item).toEqual(pieData);
  });
});
