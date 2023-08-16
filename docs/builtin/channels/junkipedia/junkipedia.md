# Class: `JunkipediaChannel`

- extends [`PageChannel`](../../../channels/page.md)

A built-in [Channel](../../../channels/channel.md) for aggregating posts as [SocialMediaPosts](../../post.md) from social media platforms supported by the Junkipedia API.

By default, this [Channel](../../../channels/channel.md) works by paginating through posts returned by the Junkipedia `/posts` endpoint. If no initial timestamp is provided, then this [Channel](../../../channels/channel.md) sets the timestamp to three hours ago and begins paginating posts authored from then on. As new posts are returned by the API, this Channel leverages its underlying [PageChannel](../../../channels/page.md) architecture to catch up page-by-page to the posts being authored in the present.

## `JunkipediaChannel(options)`

- `options`: [JunkipediaOptions](#interface-junkipediaoptions)

Initializes a new JunkipediaChannel.

```javascript
const { builtin } = require('downstream');
const { JunkipediaChannel } = builtin;

const junkipediaChannel = new JunkipediaChannel({

  apiKey: process.env.JUNKIPEDIA_API_KEY

});
```

Visit the section on [JunkipediaOptions](#interface-junkipediaoptions) below to learn about configuration.

# Interface: `JunkipediaOptions`
- extends [`PageOptions`](../../../channels/page.md#interface-pageoptions)

## `junkipediaOptions.apiKey`
- Type: `string`

A Junkipedia API key required for access to the Junkipedia API.

## `junkipediaOptions.queryParams?`

- Type: `Object.<string, string>`

The query parameters passed to the Junkipedia API on each call to the endpoints above. Visit the [Junkipedia API documentation](https://docs.junkipedia.org/reference-material/api) to learn more about what query parameters are available. Several of these parameters have provided defaults that you can easily override:

| Query parameter | Default value  |
| ----------------- | ------------- |
| `per_page`            | `100` |

## `junkipediaOptions.nextPageURL?`

- Type: `string`

An optional most recent "next page" URL returned by the Junkipedia API to start paginating from where this [JunkipediaChannel](#class-junkipediachannel) might have last left off.

Junkipedia API endpoints that support pagination return a helpful "next page" URL that indicates what URL to point to next in order to fetch the next page of data.

## `junkipediaOptions.namespace?`
- Type: `string`
- Default: `junkipedia-<hash>`

Where `<hash>` is a SHA-256 hash of the [`junkipediaOptions.apiKey`](#junkipediaoptionsapikey) string.
