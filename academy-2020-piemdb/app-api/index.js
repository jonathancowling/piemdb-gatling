const morgan = require('morgan');
const uuid = require('uuid-random');
const express = require('express');
const cors = require('cors');
const lunr = require('lunr');
const fs = require('fs').promises;
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const validateRecapture = require('./validateRecapture');

const app = express();
app.use(morgan('tiny'));

const port = 3000;
const { getPieById } = require('./dynamodb-query/getPieById');
const { randomDateReturn, getFirstDayOfWeek } = require('./randomDateGenerator.js');
const { getRandomPieLE } = require('./dynamodb-query/getRandomPieLE');
const { getRandomPieGT } = require('./dynamodb-query/getRandomPieGT');
const envVarChecker = require('./envVarChecker');
const { getReviewsById } = require('./dynamodb-query/getReviewsById');
const { submitReviewByPieId } = require('./dynamodb-query/submitReviewByPieId');
const { submitPie } = require('./dynamodb-query/submitPie');
const { checkReview } = require('./checkingFunctions/checkReview');

app.use(cors({ origin: true }));
app.use(express.json());

const stage = process.env.NODE_ENV;

app.get('/pie/:id', async (req, res) => {
  const { id } = req.params;
  const pie = await getPieById(id);
  res.json(pie);
});

app.get('/review/:id', async (req, res) => {
  const { id } = req.params;
  const pieReviews = await getReviewsById(id);
  res.json(pieReviews);
});

app.put('/review', async (req, res) => {
  // check for correct input format
  const { review } = req.body;
  if (!checkReview(review)) {
    res.status(400).json('invalid review, please check length of name and review');
    return;
  }
  // check for re-captcha validity
  const { token } = req.body;
  const captureResponse = await validateRecapture(token);
  if (!captureResponse && stage === 'prod') {
    res.status(400).json('Failed captcha, please retry');
    return;
  }
  console.log('all /review check passed');
  // generate the current date
  const dateTime = new Date();
  const date = JSON.stringify(dateTime).substring(1, 11);
  review['date-posted'] = date;
  // generate the review specific sort-key
  review['sort-key'] = `REVIEW-${uuid()}`;
  submitReviewByPieId(review);
  res.json(review);
});

app.get('/randomPie', async (req, res) => {
  // returns a uuid of a random pie
  const randomUUID = uuid();
  let randomDate;
  let pie;
  // Randomise date 10 times - for low % to hit a date with no pie in
  for (let attempts = 0; attempts < 10; attempts += 1) {
    randomDate = randomDateReturn();
    // eslint-disable-next-line no-await-in-loop
    pie = await getRandomPieLE(randomDate, randomUUID);
    if (pie === undefined) {
      // eslint-disable-next-line no-await-in-loop
      pie = await getRandomPieGT(randomDate, randomUUID);
    }
    if (pie !== undefined) {
      break;
    }
  }
  if (pie) {
    res.json(pie.uuid);
  } else {
    // After multiple attempts, no valid pie found
    res.sendStatus(500);
  }
});

app.put('/submitPie', async (req, res) => {
  const randomUUID = uuid();

  const { token } = req.body;
  const captureResponse = await validateRecapture(token);
  if (!captureResponse && stage === 'prod') {
    res.status(400).json('Failed captcha, please retry');
    return;
  }

  // Remove time component from today's date
  const today = new Date();
  const submittedDate = new Date(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(), 0, 0, 0, 0,
  ));
  const { pieData } = req.body;
  pieData.uuid = randomUUID;
  pieData['date-posted'] = JSON.stringify(submittedDate).substring(1, 11);
  pieData['week-posted'] = JSON.stringify(getFirstDayOfWeek(submittedDate)).substring(1, 11);
  pieData['sort-key'] = 'PIE';
  await submitPie(pieData);

  res.json(randomUUID);
});

app.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const searchTerms = query.split(' ').map((t) => `${t}~1`).join(' ');
  // Load index
  let data;
  // will run on prod/test bucket if the env var is defined
  if (stage === 'prod' || process.env.INDEX_BUCKET_NAME) {
    const s3 = new AWS.S3();
    const s3Params = {
      Bucket: process.env.INDEX_BUCKET_NAME,
      Key: 'index.json',
    };
    data = (await s3.getObject(s3Params).promise()).Body.toString('utf-8');
  } else {
    data = await fs.readFile('./index.json');
  }
  const idx = lunr.Index.load(JSON.parse(data));
  const results = idx.search(searchTerms);
  res.json(results.map((r) => r.ref));
});

app.use((req, res) => {
  res.send("Endpoint doesn't exist...");
});
// throw error if incorrect env vars set
envVarChecker();

/* istanbul ignore next  */
if (stage !== 'test' && stage !== 'prod') {
  app.listen(port, () => {
    console.log(`PieMDB app-api listening at port ${port} on ${stage}`);
  });
}

module.exports = { app };
