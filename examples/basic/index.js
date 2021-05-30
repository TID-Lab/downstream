/**
 * A basic example that logs each item from a Channel to the console.
 * Try running this example yourself to see Downstream in action.
 */

const { Downstream, Channel } = require('downstream');

// a hook to log all items to the console
async function logHook(item, next) {
  console.log(`Item #${item.i}`);
  await next();
}

const channel = new Channel();

const downstream = new Downstream();

// register channels
downstream.register(channel);

// use hooks
downstream.use(logHook);

// log any errors
downstream.on('error', console.log);

(async () => {
  // start Downstream
  await downstream.start();

  let i = 0;

  // enqueue a new item every second
  setInterval(() => {

    channel.enqueue({ i });

    i += 1;

  }, 1000);

})();