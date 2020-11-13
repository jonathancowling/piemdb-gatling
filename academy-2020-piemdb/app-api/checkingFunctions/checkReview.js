const { textLengthChecker } = require('./textLengthChecker');

const checkReview = (review) => {
  const nameCheck = textLengthChecker(review.name.length, 25);
  const reviewCheck = textLengthChecker(review['review-text'].length, 500);

  return (nameCheck && reviewCheck);
};

module.exports = { checkReview };
