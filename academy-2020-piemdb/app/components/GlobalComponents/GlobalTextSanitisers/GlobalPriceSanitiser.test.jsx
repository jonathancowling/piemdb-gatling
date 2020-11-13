import React from 'react';
import each from 'jest-each';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import {
  splitPrice, checkValidDecimalOnPrice, isValidPrice, GlobalPriceSanitiser,
} from './GlobalPriceSanitiser.jsx';

afterEach(cleanup);

describe('/components/GlobalTextSanitisers/GlobalPriceSanitiser.jsx | splitPrice', () => {
  it('split a price correctly', () => {
    const input = '£10.99';
    const output = splitPrice(input);
    const expected = '10.99';

    expect(output).toBe(expected);
  });
});

describe('/components/GlobalTextSanitisers/GlobalPriceSanitiser.jsx | checkValidDecimalOnPrice', () => {
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

describe('/components/GlobalTextSanitisers/isValidPrice | isValidPrice', () => {
  it('return true for valid price', () => {
    const input = '£10.99';
    const output = isValidPrice(input);
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
    const output = isValidPrice(input);
    const expected = false;

    expect(output).toBe(expected);
  });
});

describe('/components/GlobalTextSanitisers/GlobalPriceSanitiser.jsx | GlobalPriceSanitiser', () => {
  it('should should display for an invalid price', () => {
    render(<GlobalPriceSanitiser price='10.99' />);

    const element = screen.queryByText('This price is invalid');
    expect(element).toBeTruthy();
    expect(element.style.color).toBe('red');
  });

  it('should should display for an invalid price', () => {
    render(<GlobalPriceSanitiser price='£10.99' />);

    const element = screen.queryByText('This price is invalid');
    expect(element).toBeFalsy();
  });

  it('should call the blockFormSetter function with true for an invalid price', () => {
    const blockFunction = jest.fn();

    render(<GlobalPriceSanitiser price='10.99' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(true);
  });

  it('should call the blockFormSetter function with false for a valid price', () => {
    const blockFunction = jest.fn();

    render(<GlobalPriceSanitiser price='£10.99' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(false);
  });
});
