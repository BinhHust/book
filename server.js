const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_REMOTE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // eslint-disable-next-line prettier/prettier
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfully!');
  });

// Listen requests from app in port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running in port ${port}`);
});
