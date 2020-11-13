const getURL = require('./getURL');

const makeSearch = async (query) => {
  const url = getURL();
  const searchResults = await fetch(`${url}/search/${query}`);
  return searchResults.json();
};

export default makeSearch;
