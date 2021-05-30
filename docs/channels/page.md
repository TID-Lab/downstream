# Class: `PageChannel`

- extends [`PollChannel`](./poll.md)

A [`PollChannel`](./channel.md) that pages through its external data source.

## `PageChannel(options)`

- `options`: [PageOptions](#interface-pageoptions)

Initializes a new PageChannel.

```javascript
const { PageChannel } = require('downstream');

const lastTimestamp = // retrieve from database

// TODO TODO TODO explain the whole need to persist `lastTimestamp` better

const pageChannel = new PageChannel({
  lastTimestamp,
  onFetch: (lastTimestamp) => {
    // save to database
  }
});
```

## `pageChannel.lastTimestamp`

- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

The most recent timestamp among the [TimestampedItems](#interface-timestampeditem) returned in the last page from [`fetchPage()`](#abstract-pagechannelfetchpage). Use this field in your implementation of [`fetchPage()`](#abstract-pagechannelfetchpage) to fetch the next page by starting from the end of the previous page of data.

## abstract `pageChannel.fetchPage()`
- Returns: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[TimestampedItem](#interface-timestampeditem)[]\>

Fetches the next page of data from an external source and turns it into an array of [TimestampedItems](#interface-timestampeditem).

```javascript
class CustomPageChannel extends PageChannel {

  async fetchPage() {
    const items = [];

    // fetch data and convert it into a TimestampedItem array

    return items;
  }

}
```

After `pageChannel.fetchPage()` is called, the [PageChannel](#class-pagechannel) sorts each [TimestampedItem](#interface-timestampeditem) in ascending order by each of their timestamps, enqueues each, and calls the [`onFetch()`](#pageoptionsonfetch) callback with the updated value of [`pageChannel.lastTimestamp`](#pagechannellasttimestamp) (the most recent timestamp among each [TimestampedItem](#interface-timestampeditem)) as an argument.

# Interface: `PageOptions`

```javascript
const lastTimestamp = // retrieve from database

const onFetch = (lastTimestamp) => {
  // save to database
}

const pageOptions = {
  lastTimestamp,
  onFetch
};
```

## `pageOptions.lastTimestamp?`
- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

The most recent timestamp to start from when paginating with the first [`pageChannel.fetchPage()`](#abstract-pageChannelfetchpage) call.

## `pageOptions.onFetch()?`
- Type: [FetchCallback()](#function-fetchcallbacklasttimestamp)

The function called after each [`pageChannel.fetchPage()`](#abstract-pagechannelfetchpage) call has completed.


# Function: `FetchCallback(lastTimestamp)`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

The function called after each [`pageChannel.fetchPage()`](#abstract-pagechannelfetchpage) call has completed.

Typically, this function is used to save the most recent value of [`pageChannel.lastTimestamp`](#pagechannellasttimestamp) to a database so that it can persist across runtimes by passing it in via the [`PageChannel(options)`](#pagechanneloptions) constructor.

## `lastTimestamp`
- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

The most recent timestamp of the [TimestampedItems](#interface-timestampeditem) returned by a [`fetchPage()`](#abstract-pagechannelfetchpage) call.

# Interface: `TimestampedItem`
- extends [`Item`](../item.md)

A timestamped [Item](../item.md).

## `timestampedItem.getTimestamp()`
- Returns: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Returns the timestamp of this [TimestampedItem](#interface-timestampeditem).

