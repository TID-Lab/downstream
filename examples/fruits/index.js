/**
 * An example that uses a custom Channel to aggregate data from a fruit API.
 */

 const { Downstream } = require('downstream');
 const FruitChannel = require('./fruitChannel');
 const startFruitServer = require('./fruitServer');
 
 const fruitChannel = new FruitChannel({
     interval: 1000, // poll every second
 });
 
 const downstream = new Downstream();
 
 // register channels
 downstream.register(fruitChannel);
 
 // use hooks
 downstream.use(async (post, next) => {
 
     console.log(post); // log each fake post to the console
 
     await next();
 });
 
 // log any errors
 downstream.on('error', console.log);
 
 // start our fruit API
 startFruitServer();
 
 // start Downstream
 downstream.start();