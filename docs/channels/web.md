# Class: `WebChannel`

- extends [`Channel`](./channel.md)

A [`Channel`](./channel.md) that receives [Items](../item.md) via its mounted path on a background HTTP server.

To send an [Item](../item.md) to a specific [WebChannel](#class-webchannel), send the following HTTP request:
  - Method: `POST`
  - Path: `/<path>` where `<path>` is the [WebChannel](#class-webchannel) path
  - Body: the [Item](../item.md) as a JSON object

## `WebChannel(path)`

- `path`: `string`

Initializes a new WebChannel to be mounted on the given URL path.

```javascript
const { WebChannel } = require('downstream');

// to be mounted on the /items path
const webChannel = new WebChannel('items');
```

## static `WebChannel.PORT`
- Type: `number`
- Default: `3000`

The port that the backround HTTP server runs on. Change this field before starting any [WebChannel](#class-webchannel) to change the port to a value other than the default.

## `webChannel.start()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Mounts this [WebChannel](#class-webchannel) on the background HTTP server using its path.

Starts the HTTP server in the background if no other [WebChannels](#class-webchannel) have started yet.

## `webChannel.stop()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Unmounts this [WebChannel](#class-webchannel) from the background HTTP server.

Stops the HTTP server running in the background if no other [WebChannels](#class-webchannel) are still active.
