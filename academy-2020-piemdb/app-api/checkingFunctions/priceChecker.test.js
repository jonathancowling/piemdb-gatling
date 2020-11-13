const each = require('jest-each').default;
const {
  splitPrice,
  checkValidDecimalOnPrice,
  priceChecker,
} = require('./priceChecker');

describe('/app-api/checkingFunctions/priceChecker.js | splitPrice', () => {
  it('split a price correctly', () => {
    const input = '£10.99';
    const output = splitPrice(input);
    const expected = '10.99';

    expect(output).toBe(expected);
  });
});

describe('/app-api/checkingFunctions/priceChecker.js | checkValidDecimalOnPrice', () => {
  it('return true for valid price', () => {
    const input = '£10.99';
    const output = checkValidDecimalOnPrice(input);
    const expected = true;

    expect(output).toBe(expected);
  });

  each([
    [
      '£10.99.1',
    ],
    [
      '£10.999',
    ],
    [
      '£10.9',
    ],
  ]).it('return false for invalid price', (input) => {
    const output = checkValidDecimalOnPrice(input);
    const expected = false;

    expect(output).toBe(expected);
  });
});

describe('/app-api/checkingFunctions/priceChecker.js | priceChecker', () => {
  it('return true for valid price', () => {
    const input = '£10.99';
    const output = priceChecker(input);
    const expected = true;

    expect(output).toBe(expected);
  });

  each([
    [
      '10.99',
    ],
    [
      '$10.99',
    ],
    [
      '£10.99.1',
    ],
    [
      '£10.999',
    ],
    [
      '£10.9',
    ],
  ]).it('return false for invalid price', (input) => {
    const output = priceChecker(input);
    const expected = false;

    expect(output).toBe(expected);
  });
});
