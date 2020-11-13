const envVarChecker = () => {
  const env = process.env.NODE_ENV;
  if (env !== 'prod' && env !== 'dev' && env !== 'test') {
    throw new Error('NODE_ENV, environment variable, should be prod, dev or test');
  }
};

module.exports = envVarChecker;
