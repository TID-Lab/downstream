# Interface: `TwitterOptions`
- extends [`ChannelOptions`](../../.././../channels/channel.md#interface-channeloptions)

## `twitterOptions.credentials`
- Type: [TwitterCredentials](#interface-twittercredentials)

A collection of secrets and keys required for access to the Twitter v2 API.

## `twitterOptions.queryParams?`

- Type: `Object.<string, string>`

The query parameters passed to the Twitter v2 API. Several of these parameters have provided defaults that you can easily override:

| Query parameter   | Default value   |
| ----------------- | ------------- |
| `expansions`      | [ `'author_id'` ]      |
| `tweet.fields`    | [ `'author_id'`, `'created_at'`, `'geo'`, `'id'`, `'referenced_tweets'` ]        |
| `user.fields`     | [`'id'`, `'location'`, `'public_metrics'`, `'username'`, `'verified'` ]         |
| `max_results`* | `100` |

\* Included only in [TwitterPageChannel](../page.md) query parameters.

## `twitterOptions.namespace?`
- Type: `string`
- Default: `twitter`

# Interface: `TwitterCredentials`

A collection of secrets and keys required for access to the Twitter v2 API.

## `twitterCredentials.consumerKey`

A Twitter API consumer key.

## `twitterCredentials.consumerSecret`

A Twitter API consumer secret.

## `twitterCredentials.accessToken?`

A Twitter API access token.

## `twitterCredentials.accessTokenSecret?`

A Twitter API access token secret.