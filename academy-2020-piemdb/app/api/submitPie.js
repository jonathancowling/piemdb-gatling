const getURL = require('./getURL');

const SubmitPie = async (pieData, token) => {
  const url = getURL();
  const toSend = { pieData, token };
  const response = await fetch(`${url}/submitPie`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  });
  const result = await response.json();
  return result;
};

export default SubmitPie;
