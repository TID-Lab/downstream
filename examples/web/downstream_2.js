/**
 * Downstream #2: Sends all items to Downstream #1.
 */

const { Downstream, Channel } = require('downstream');
const axios = require('axios').default;

// a hook to send all items to Downstream #1
async function sendHook(item, next) {
  await axios({
    method: 'POST',
    baseURL: 'http://localhost:3000',
    url: '/demo', // the path of the WebChannel registered on Downstream #1
    data: JSON.stringify(item),
  });

  await next();
}

const channel = new Channel();

const downstream = new Downstream();
 
// register channels
downstream.register(channel);

// use hooks
downstream.use(sendHook);

// log any errors
downstream.on('error', console.log);

module.exports = { downstream, channel };