const validUrl = require('valid-url');

const urlChecker = (url) => {
  // this is needed because validUrl does not return boolean
  if (validUrl.isUri(url)) {
    return true;
  }
  return false;
};

module.exports = { urlChecker };
