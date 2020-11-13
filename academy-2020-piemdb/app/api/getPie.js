const getURL = require('./getURL');

const getPie = async (pieId) => {
  const url = getURL();
  const pieJson = await fetch(`${url}/pie/${pieId}`);
  return pieJson.json();
};

export default getPie;
