const each = require('jest-each').default;
const { totalDays } = require('./randomDateGenerator');
const { randomWeek } = require('./randomDateGenerator');
const { randomDateReturn } = require('./randomDateGenerator');
const { getFirstDayOfWeek } = require('./randomDateGenerator');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('totalDays', () => {
  each([
    [new Date(2020, 9, 19), 7],
    [new Date(2020, 10, 12), 31],
    [new Date(2021, 9, 12), 365],
    [new Date(2021, 10, 12), 396],
    [new Date(2020, 9, 11), -1],
  ]).it('returns the number of days between the current day and the date 2020-9-12',
    (date, expectedOutput) => {
      const actualOutcome = totalDays(date);
      expect(actualOutcome).toBe(expectedOutput);
    });
});

describe('randomWeek', () => {
  each([
    [new Date(2020, 9, 19), 0.5],
    [new Date(2020, 9, 19), 0],
    [new Date(2020, 9, 19), 1],
  ]).it('returns a random number', (date, randomNumber) => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => (randomNumber);
    global.Math = mockMath;

    const totalWeeks = Math.floor(totalDays(date) / 7);
    const expectedOutput = Math.floor(randomNumber * Math.floor(totalWeeks + 1));
    const actualOutput = randomWeek(date);

    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('randomDateReturn', () => {
  it('should return a date in a valid format', () => {
    const output = randomDateReturn();
    // regex for yyyy-mm-dd date format
    const re = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const matchesFormat = re.test(output);
    expect(matchesFormat).toBe(true);
  });
});

// [new Date(2020, 10, 22), new Date(2020, 10, 16)],
// [new Date(2020, 10, 30), new Date(2020, 10, 30)],
describe('getFirstDayOfTheWeek', () => {
  each([
    [new Date(2020, 10, 5), new Date(2020, 10, 2)],
    [new Date(2020, 10, 22), new Date(2020, 10, 16)],
    [new Date(2020, 10, 30), new Date(2020, 10, 30)],
    [new Date(2020, 10, 4), new Date(2020, 10, 2)],
  ]).it('Should return the date of the first day of that week when passed a date', (givenDay, startOfWeek) => {
    const actualOutput = getFirstDayOfWeek(givenDay);
    expect(actualOutput).toEqual(startOfWeek);
  });
});
