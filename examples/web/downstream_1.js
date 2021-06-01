/**
 * Downstream #1: Registers a WebChannel with path `demo`
 */

const { Downstream, WebChannel } = require('downstream');

const downstream = new Downstream();

async function logHook(item, next) {
  console.log(item);
  await next();
}

const webChannel = new WebChannel({ path: 'demo' });

// register channels
downstream.register(webChannel);

// use hooks
downstream.use(logHook);

// log any errors
downstream.on('error', console.log);

module.exports = { downstream };