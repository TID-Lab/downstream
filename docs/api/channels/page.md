# Class: `PageChannel`

- extends [`PollChannel`](./poll.md)

A [`PollChannel`](./channel.md) that pages through its external data source.

## `PageChannel(options)`

- `options`: [PageOptions](#Interface:-PageOptions)

Initializes a new PageChannel.

```javascript
const lastTimestamp = // retrieve from database

const pageChannel = new PageChannel({
  lastTimestamp,
  onFetch: (lastTimestamp) => {
    // save to database
  }
});
```

## `pageChannel.lastTimestamp`

- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

The most recent timestamp among the [TimestampedItems](#Interface-TimestampedItem) returned in the last page from [`fetchPage()`](#abstract-pageChannel.fetchPage()). Use this field in your implementation of [`fetchPage()`](#abstract-pageChannel.fetchPage()) to fetch the next page by starting from the end of the previous page of data.

## abstract `pageChannel.fetchPage()`
- Returns: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[TimestampedItem](#Interface-TimestampedItem)[]\>

Fetches the next page of data from an external source and turns it into an array of [TimestampedItems](#Interface-TimestampedItem).

```javascript
class CustomPageChannel extends PageChannel {

  async fetchPage() {
    const items = [];

    // fetch data and convert it into a TimestampedItem array

    return items;
  }

}
```

After `pageChannel.fetchPage()` is called, the [PageChannel](#Class:-PageChannel) sorts each [TimestampedItem](#Interface-TimestampedItem) in ascending order by each of their timestamps, enqueues each, and calls the [`onFetch()`](#pageOptions.onFetch()?) callback with the updated value of [`pageChannel.lastTimestamp`](#pageChannel.lastTimestamp) (the most recent timestamp among each [TimestampedItem](#Interface-TimestampedItem)) as an argument.

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

The most recent timestamp to start from when paginating with the first [`pageChannel.fetchPage()`](#abstract-pageChannel.fetchPage()) call.

## `pageOptions.onFetch()?`
- Type: [FetchCallback()](#Function-FetchCallback(lastTimestamp))

The function called after each [`pageChannel.fetchPage()`](#abstract-pageChannel.fetchPage()) call has completed.


# Function: `FetchCallback(lastTimestamp)`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

The function called after each [`pageChannel.fetchPage()`](#abstract-pageChannel.fetchPage()) call has completed.

Typically, this function is used to save the most recent value of [`pageChannel.lastTimestamp`](#pageChannel.lastTimestamp) to a database so that it can persist across runtimes by passing it in via the [`PageChannel(options)`](#PageChannel(options)) constructor.

## `lastTimestamp`
- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

The most recent timestamp of the [TimestampedItems](#Interface-TimestampedItem) returned by a [`fetchPage()`](#abstract-pageChannel.fetchPage()) call.

# Interface: `TimestampedItem`
- extends [`Item`](../item.md)

A timestamped [Item](../item.md).

## `timestampedItem.getTimestamp()`
- Returns: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Returns the timestamp of this [TimestampedItem](#Interface-TimestampedItem).

