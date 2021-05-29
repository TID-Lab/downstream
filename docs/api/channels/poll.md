# Class: `PollChannel`

- extends [`Channel`](./channel.md)

A [`Channel`](./channel.md) that polls an external data source on a regular interval via the [`fetch()`](#abstract-pollChannel.fetch()) function.

## `PollChannel(options)`

- `options`: [PollOptions](#Interface-PollOptions)

Initializes a new PollChannel.

```javascript
const pollChannel = new PollChannel({ interval: 5000 });
```

## `pollChannel.start()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Begins polling the external data source.

## `pollChannel.stop()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Stops polling the external data source.

## abstract `pollChannel.fetch()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Fetches data from an external source and [enqueues](./channel.md#channel.enqueue(item)) it as [Items](../item.md).

```javascript
class CustomPollChannel extends PollChannel {

  async fetch() {

    const item = ... // fetch data from an external source
    this.enqueue(item); // enqueue it as an Item

  }

}
```

# Interface: `PollOptions`

```javascript
const pollOptions = {
  delay: 2000,
  interval: 5000
};
```

## `pollOptions.delay?`
- Type: `number`
- Default: `0`

The delay in milliseconds before the first poll.

## `pollOptions.interval?`
- Type: `number`
- Default: `10000`

The interval in milliseconds between each poll.

