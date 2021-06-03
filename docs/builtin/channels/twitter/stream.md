# Class: `TwitterStreamChannel`

- extends [`Channel`](../../../channels/channel.md)

A built-in [Channel](../../../channels/channel.md) for aggregating tweets as [SocialMediaPosts](../../post.md) from Twitter through a live stream.

This [Channel](../../../channels/channel.md) works by streaming tweets being authored in the present through the Twitter v2 "filtered stream" API.

## `TwitterStreamChannel(options)`

- `options`: [TwitterOptions](./shared/options.md)

Initializes a new TwitterStreamChannel.

```javascript
const { builtin } = require('downstream');
const { TwitterStreamChannel } = builtin;

const twitterStreamChannel = new TwitterStreamChannel({

  credentials: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  }

});
```

Visit the section on [TwitterOptions](./shared/options.md) to learn about configuration.

## `twitterStreamChannel.start()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Starts the Twitter v2 API filtered stream.

## `twitterStreamChannel.stop()`
- Returns: [Promise\<void\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Stops the Twitter v2 API filtered stream.

## `twitterStreamChannel.getStreamRules()`
- Returns: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<`any[]`>

Returns the rules for the Twitter v2 API filtered stream.

## `twitterStreamChannel.updateStreamRules(body)`
- `body:` `Object`
- Returns: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<`any`>

Updates the rules for the Twitter v2 API filtered stream using given request body.