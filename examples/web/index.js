/**
 * An example that demonstrates how a WebChannel might
 * be used to connect two Downstream instances together.
 */

const { downstream: ds1 } = require('./downstream_1');
const { downstream: ds2, channel } = require('./downstream_2');

(async () => {
  await ds1.start();
  await ds2.start();

  // each item will shortly be sent from Downstream #2 to #1...
  // ... all via a WebChannel! Very cool.

  channel.enqueue({ foo: 'bar' });
  channel.enqueue({ Hello: 'World!'});
  channel.enqueue({ lorem: 'ipsum'});
})();