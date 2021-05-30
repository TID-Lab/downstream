/**
 * An example that saves tweets about cats to your local MongoDB database.
 */

 const { Downstream, builtin } = require('downstream');
 const { TwitterPageChannel } = builtin;
 const db = require('./db');
 const saveToDatabase = require('./hook');
 
 const twitterChannel = new TwitterPageChannel({
     credentials: {
         consumerKey: process.env.TWITTER_CONSUMER_KEY,
         consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
     },
     queryParams: {
         query: 'cat',
         max_results: 10, // set low for demo purposes
     },
 });
 
 const downstream = new Downstream();
 
 // register channels
 downstream.register(twitterChannel);
 
 // use hooks
 downstream.use(saveToDatabase);
 
 // log any errors
 downstream.on('error', console.log);
 
 (async () => {
 
     // connect to your local MongoDB database
     await db();
 
     // start Downstream
     await downstream.start();
 
 })();