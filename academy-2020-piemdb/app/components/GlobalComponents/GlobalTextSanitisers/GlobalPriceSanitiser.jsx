import React from 'react';
import PropTypes from 'prop-types';

export const splitPrice = (price) => {
  // remove the currency from the start of the price
  const number = price.replace(price[0], '');
  return number;
};

export const checkValidDecimalOnPrice = (price) => {
  const number = splitPrice(price);

  // check for number of '.'
  const numberOfDecimals = number.split('').filter((char) => char === '.');
  if (numberOfDecimals.length === 1) {
    //  check there are two digits after the '.'
    const decimals = number.split('.')[1];
    if (decimals.length === 2) {
      return true;
    }
  }
  return false;
};

export const isValidPrice = (price) => {
  if (price[0] === '£' && checkValidDecimalOnPrice(price)) {
    return true;
  }
  return false;
};

export const GlobalPriceSanitiser = ({ price, message, blockFormSetter }) => {
  const displayedMessage = isValidPrice(price) ? '' : message;
  const displayedMessageBool = !isValidPrice(price);

  // block the form if one exists
  if (displayedMessageBool) {
    blockFormSetter(true);
  } else {
    blockFormSetter(false);
  }

  return <div id='price-sanitiser' style={{ color: 'red', 'font-family': 'Catamaran' }}>{displayedMessage}</div>;
};

GlobalPriceSanitiser.propTypes = {
  price: PropTypes.string.isRequired,
  message: PropTypes.string,
  label: PropTypes.string,
  blockFormSetter: PropTypes.func,
};

GlobalPriceSanitiser.defaultProps = {
  message: 'This price is invalid',
  label: 'price-sanitiser',
  blockFormSetter: () => {},
};
