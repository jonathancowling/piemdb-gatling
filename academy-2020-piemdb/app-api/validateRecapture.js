const fetch = require('node-fetch');

const validateRecapture = async (token) => {
  const secret = process.env.RECAPTCHA_KEY;
  const submitResult = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
    method: 'GET',
  }).then(async (response) => {
    const stuff = await response.json();
    return JSON.stringify(stuff.success);
  });
  return submitResult;
};

module.exports = validateRecapture;
