# Class: `Channel`

- extends [`EventEmitter`](https://nodejs.org/docs/latest-v12.x/api/events.html#events_class_eventemitter)

A Channel represents a stream of [Items](../item.md) from some external data source, like a web API.

Internally, Channels work by maintaining a circular queue of some fixed capacity that temporarily stores as many [Items](../item.md) as possible until they can be dequeued and fed into the [Downstream](../downstream.md) instance to which this [Channel](#Class-Channel) is registered.

## `Channel()`

Initializes a new Channel.

```javascript
const { Channel } = require('downstream');

const channel = new Channel();
```

## Event: `error`

- `err`: an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object

Emitted when an error occurs.

## Event: `empty`

Emitted when the internal queue is empty after storing some number of [Items](../item.md). 

This event is used by a [Downstream](../downstream.md) instance to know when [Items](../item.md) are available to dequeue.

## Event: `notEmpty`

Emitted when the internal queue has some number of [Items](../item.md) after being empty. 

This event is used by a [Downstream](../downstream.md) instance to know when [Items](../item.md) are available to dequeue.

## `channel.started`

- Type: `boolean`

Whether this [Channel](#Class-Channel) is running after being started with [`channel.start()`](#channel.start()).

## `channel.start()`

- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Starts this [Channel](#Class-Channel) so that it will stream [Items](../item.md) from some external source. Depending on the type of Channel, "starting" could mean:

- starting an HTTP stream
- adding listeners to events
- scheduling the first `setTimeout` to poll a web API

## `channel.stop()`

- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Stops this [Channel](#Class-Channel) so that it will stop streaming [Items](../item.md) from some external source. Depending on the type of Channel, "stopping" could mean:

- stopping an HTTP stream
- removing listeners from events
- clearing the next `setTimeout` to stop polling a web API

## `channel.enqueue(item)`

- `item`: [Item](../item.md)

Enqueues an [Item](../item.md) from some external source onto the internal queue.

## `channel.dequeue()`

- Returns: [Item](../item.md) | `null`

Dequeues an [Item](../item.md) from the internal queue, if available.

This function is used by a [Downstream](../downstream.md) instance to feed [Items](../item.md) from this [Channel](#Class-Channel) to a set of [hooks](../downstream.md#Function-Hook(item)).

## `channel.isEmpty()`

- Returns: `boolean`

Returns whether the internal queue is empty.