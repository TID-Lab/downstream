/**
 * An example that demonstrates how to build a custom
 * channel to aggregate data from your own sources.
 * 
 * NOTE: This example has the following dependencies:
 *  - axios
 *  - express
 * 
 * Install these dependencies with `npm install axios express`.
 */

 const { Downstream } = require('downstream');
 const FakeChannel = require('./fakeChannel');
 const startFakeServer = require('./fakeServer');
 
 const fakeChannel = new FakeChannel({
     interval: 1000, // poll every second
 });
 
 const downstream = new Downstream();
 
 // register channels
 downstream.register(fakeChannel);
 
 // use hooks
 downstream.use(async (post, next) => {
 
     console.log(post); // log each fake post to the console
 
     await next();
 });
 
 // log any errors
 downstream.on('error', console.log);
 
 // start our fake server
 startFakeServer();
 
 // start Downstream
 downstream.start();