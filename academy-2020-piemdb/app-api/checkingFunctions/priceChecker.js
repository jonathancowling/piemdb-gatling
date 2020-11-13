const splitPrice = (price) => {
  // remove the currency from the start of the price
  const number = price.replace(price[0], '');
  return number;
};

const checkValidDecimalOnPrice = (price) => {
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

const priceChecker = (price) => {
  if (price[0] === '£' && checkValidDecimalOnPrice(price)) {
    return true;
  }
  return false;
};

module.exports = {
  splitPrice,
  checkValidDecimalOnPrice,
  priceChecker,
};
