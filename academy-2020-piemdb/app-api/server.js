require('dotenv').config();
const { app } = require('./index');

app.listen(() => {
  console.log('PieMDB app-api listening at port 3000');
});
