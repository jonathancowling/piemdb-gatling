const getURL = require('./getURL');

const getRandPie = async () => {
  const url = getURL();
  const pieJson = await fetch(`${url}/randomPie`);
  const test = await pieJson.json();
  return test;
};
export default getRandPie;
