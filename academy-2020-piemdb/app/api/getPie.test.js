import fetchMock from 'jest-fetch-mock';
import getPie from './getPie';

fetchMock.enableMocks();

const pieData = {
  image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/steakandkidneypie_73308_16x9.jpg',
  'date-posted': '2020-10-12',
  'week-posted': '2020-10-12',
  name: 'Steak and Kidney',
  description: 'A reyt gud pie',
  location: 'Leeds',
  'sort-key': 'PIE',
  uuid: '0000-0000-0002',
};

beforeEach(() => {
  fetch.resetMocks();
});

describe('/api/getPie', () => {
  it('should return a specific pie by id', async () => {
    fetch.mockResponseOnce(JSON.stringify(pieData));

    const pie = await getPie('0000-0000-0002');

    expect(pie.uuid).toBe('0000-0000-0002');
    expect(pie.name).toBe('Steak and Kidney');
    expect(pie.location).toBe('Leeds');
    expect(pie['date-posted']).toBe('2020-10-12');
    expect(pie['week-posted']).toBe('2020-10-12');
    expect(pie.description).toBe('A reyt gud pie');
    expect(pie.image).toBe('https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/steakandkidneypie_73308_16x9.jpg');
  });
});
