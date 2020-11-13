import getURL from './getURL';

export const submitReviewAPI = async (piID, review, captchaToken) => {
  const reviewCopy = JSON.parse(JSON.stringify(review));
  reviewCopy.uuid = piID;
  const toSend = { review: reviewCopy, token: captchaToken };
  const url = getURL();
  const submitResult = await fetch(`${url}/review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  });
  if (submitResult.status === 429) {
    throw new Error('Too many reviews submitted, please wait a minute and try again');
  }
  return submitResult;
};

export const getReviewsForPie = async (pieId) => {
  try {
    const url = getURL();
    const review = await fetch(`${url}/review/${pieId}`)
      .then((result) => result.json());
    return review;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return [];
  }
};
