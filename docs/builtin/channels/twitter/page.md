# Class: `TwitterPageChannel`

- extends [`PageChannel`](../../../channels/page.md)

A built-in [Channel](../../../channels/channel.md) for aggregating tweets as [SocialMediaPosts](../../post.md) from Twitter through pagination.

By default, this [Channel](../../../channels/channel.md) works by paginating by timestamp through tweets returned by the Twitter v2 API family of `/tweets/search` endpoints. Read below for specifics which endpoint are used when. If no initial timestamp is provided, then this [Channel](../../../channels/channel.md) sets the timestamp to three hours ago and begins paginating posts authored from then on. As new posts are returned by the API, this Channel leverages its underlying [PageChannel](../../../channels/page.md) architecture to catch up page-by-page to the posts being authored in the present.

## `TwitterPageChannel(options)`

- `options`: [TwitterPageOptions](#interface-twitterpageoptions)

Initializes a new TwitterPageChannel.

```javascript
const { builtin } = require('downstream');
const { TwitterPageChannel } = builtin;

const twitterPageChannel = new TwitterPageChannel({

  credentials: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  }

});
```

Visit the section on [TwitterPageOptions](#interface-twitterpageoptions) below to learn about configuration.

# Interface: `TwitterPageOptions`
- extends [`TwitterOptions`](./shared/options.md), [`PageOptions`](../../../channels/page.md#interface-pageoptions)

## `twitterPageOptions.isRecent?`
- Type: `boolean`
- Default: `true`

Whether to aggregate tweets from the past seven days (recent) or from all of time.

For those familiar with the Twitter v2 API, the following values for this property correspond to the use of two separate endpoints:

| `isRecent` | API Endpoint          |
| -----------| --------------------- |
| `true`     | /tweets/search/recent |
| `false`*     | /tweets/search/all    |

\* As of writing `isRecent` to `false` requires the Academic Research product track.

## `twitterPageOptions.nextPageToken?`

- Type: `string`

An optional most recent "next page" token returned by the Twitter v2 API to start paginating from where this [TwitterPageChannel](#class-twitterpagechannel) might have last left off.

Twitter v2 API endpoints that support pagination return a helpful "next page" token that can be used to fetch the next page of data.

## `twitterPageOptions.namespace?`
- Type: `string`
- Default: `twitter-<hash>`

Where `<hash>` is a SHA-256 hash of the [`twitterOptions.credentials`](shared/options.md#twitteroptionscredentials) object serialized with [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).