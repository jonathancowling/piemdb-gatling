require('dotenv').config();
const { app } = require('./index');

app.listen(3000, () => {
  console.log('PieMDB app-api listening at port 3000');
});
