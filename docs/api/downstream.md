# Class: `Downstream`

- extends [`EventEmitter`](https://nodejs.org/docs/latest-v12.x/api/events.html#events_class_eventemitter)

A Downstream instance.

## `Downstream()`

Initializes a new instance of Downstream.

```javascript
const downstream = new Downstream();
```

## Event: `error` 

- `err`: an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object
- `id?`: the ID of the [Channel](./channels/channel.md), if applicable

Emitted when an error occurs. Errors can either be emitted by a [Channel](./channels/channel.md) (in which case the `id` argument is set) or thrown by a [middleware function](#Function:-MiddlewareFunction(item)).

## `downstream.start()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Calls [`channel.start()`](./channels/channel.md#channel.start()) on each of the registered [Channels](./channels/channel.md) and waits for them to all start. Any errors thrown by a [Channel](./channels/channel.md) are collected and emitted via the [`error` event](#event:-error).

## `downstream.stop()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Calls [`channel.stop()`](./channels/channel.md#channel.stop()) on each of the registered [Channels](./channels/channel.md) and waits for them to all stop. Any errors thrown by a [Channel](./channels/channel.md) are collected and emitted via the [`error` event](#event:-error).

## `downstream.register(channel)`
- `channel`: [Channel](./channels/channel.md)
- Returns: `number`

Registers a [Channel](./channels/channel.md) so that [Items](./item.md) will be streamed from the [Channel](./channels/channel.md) to this [Downstream](#Class:-Downstream) instance once when the channel has been started with [`channel.start()`](./channels/channel.md#channel.start()).

## `downstream.unregister(identifier)`

- `identifier`: [Channel](./channels/channel.md) | `number`
- Returns: `number`

Unregisters a [Channel](./channels/channel.md) either using the Channel itself or its numeric ID so that [Items](./item.md) will no longer be streamed from the [Channel](./channels/channel.md) to this [Downstream](#Class:-Downstream) instance.

Note that unregistering a [Channel](./channels/channel.md) does not stop it.

```javascript
const id = downstream.register(myChannel);

// some time later...

downstream.unregister(id);
```

## `downstream.channel(id)`

- `id`: `number`
- Returns: [Channel](./channels/channel.md)

Returns the [Channel](./channels/channel.md) with the given ID returned before by [`downstream.register()`](#downstream.register(channel)).

```javascript
const id = downstream.register(myChannel);

// some time later...

const channel = downstream.channel(id);

await channel.stop();
```

## `downstream.use(middleware)`

- `middleware`: [MiddlewareFunction()](#Function:-MiddlewareFunction(item))

Adds another [middleware function](#Function:-MiddlewareFunction(item)) to an ordered set that get called on each [Item](./item.md) streamed by this [Downstream](#Class:-Downstream) instance in the order of declaration.

# Function: `MiddlewareFunction(item)`
- `item`: [Item](./item.md)
- `next`: [NextFunction()](#Function-NextFunction())

An asynchronous "middleware" function that gets called on each [Item](./item.md) of a [Downstream](#Class:-Downstream) instance as they are streamed from the registered [Channels](./channels/channel.md).

```javascript
async function myMiddleware(item, next) {

  // do something with the Item

  await next(); // call remaining middleware
}
```

Call `next()` at the end of your middleware function as shown above to call the remaining middleware functions.

# Function: `NextFunction()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Calls the remaining [middleware functions](#Function:-MiddlewareFunction(item)) that come after this one.