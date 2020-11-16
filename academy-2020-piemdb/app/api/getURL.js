const getURL = () => {
  let url = 'no environment variable provided';
  const env = process.env.NODE_ENV;

  if (env === 'prod' || env === 'test') {
    url = `https://piemdb-app-api-${env}.infinipie.works`;
  } else if (env === 'dev') {
    url = 'http://localhost:3000';
  } else {
    throw new Error(url);
  }
  return url;
};

module.exports = getURL;
