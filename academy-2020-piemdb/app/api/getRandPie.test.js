import fetchMock from 'jest-fetch-mock';
import getRandPie from './getRandPie';

fetchMock.enableMocks();

const pieID = 'a1ef63f7-db69-45b4-aae2-6cf77319cf11';

beforeEach(() => {
  fetch.resetMocks();
});

describe('/api/getRandPie', () => {
  it('should return an ID', async () => {
    fetch.mockResponseOnce(JSON.stringify(pieID));
    const uuid = await getRandPie();
    expect(uuid).toBe('a1ef63f7-db69-45b4-aae2-6cf77319cf11');
  });
});
