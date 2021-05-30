const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/catTweets';
const DB_NAME = 'catTweets';

/**
 * Establishes a connection to your local MongoDB database.
 */
module.exports = async () => {
  await mongoose
    .connect(DB_URL, {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .catch((error) => {
      console.log(error);
    })
};
