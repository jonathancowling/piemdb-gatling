const serverless = require('serverless-http');
const { app } = require('./index');

module.exports.app_api = serverless(app);
