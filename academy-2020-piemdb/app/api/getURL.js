const getURL = () => {
  let url = 'no environment variable provided';
  const env = process.env.NODE_ENV;

  if (env === 'prod') {
    url = 'https://piemdb-app-api-prod.infinipie.works';
  } else if (env === 'test') {
    url = 'https://piemdb-app-api-test.infinipie.works';
  } else if (env === 'dev') {
    url = 'http://localhost:3000';
  } else {
    throw new Error(url);
  }
  return url;
};

module.exports = getURL;
