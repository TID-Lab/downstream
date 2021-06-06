# Class: `PollChannel`

- extends [`Channel`](./channel.md)

A [`Channel`](./channel.md) that polls an external data source on a regular [interval](#polloptionsinterval) via a [`fetch()`](#abstract-pollchannelfetch) function.



[PollChannels](#class-pollchannel) in the same [namespace](#polloptionsnamespace) will take turns fetching data on their shared [interval](#polloptionsinterval). This means that you can 
pool together [PollChannels](#class-pollchannels) that share a rate-limited external data source like an API endpoint in the same [namespace](#polloptionsnamespace) to guarantee that those rate limits will not be exceeded.

## `PollChannel(options?)`

- `options?`: [PollOptions](#interface-polloptions)

Initializes a new PollChannel.

```javascript
const { PollChannel } = require('downstream');

const pollChannel = new PollChannel({ namespace: 'foo', interval: 5000 });
```

## `pollChannel.start()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Begins polling the external data source.

## `pollChannel.stop()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Stops polling the external data source.

## abstract `pollChannel.fetch()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Fetches data from an external source and [enqueues](./channel.md#channelenqueueitem) it as [Items](../item.md).

```javascript
class CustomPollChannel extends PollChannel {

  async fetch() {

    const item = ... // fetch data from an external source
    this.enqueue(item); // enqueue it as an Item

  }

}
```

# Interface: `PollOptions`
- extends [`ChannelOptions`](./channel.md#interface-channeloptions)

```javascript
const pollOptions = {
  namespace: 'foo',
  interval: 5000
};
```

## `pollOptions.namespace`
- Type: `string`

The namespace of the [PollChannel](#class-pollchannel).

## `pollOptions.interval?`
- Type: `number`
- Default: `10000`

The interval in milliseconds between each poll.

