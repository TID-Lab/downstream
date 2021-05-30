# Class: `SocialMediaPost`

- implements [TimestampedItem](../channels/page.md#Interface-TimestampedItem)

Represents a post on a social media platform.

## `SocialMediaPost(options)`
- `options`: [SocialMediaOptions](#Interface-SocialMediaOptions)

```javascript
const socialMediaPost = new SocialMediaPost({
  ... // see fields below
})
```

## `socialMediaPost.authoredAt`
- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

When the post was authored.

## `socialMediaPost.fetchedAt`
- Type: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

When the post was fetched by a [Channel](../channels/channel.md).

## `socialMediaPost.author`
- Type: `string`

The author of the post, typically a username.

## `socialMediaPost.url`
- Type: `string`

The URL of the post.

## `socialMediaPost.platform`
- Type: [Platform](#Enum-Platform)

The social media platform that the post was authored on.

## `socialMediaPost.platformID`
- Type: `string`

The ID of the post on the platform it was authored on.

## `socialMediaPost.content?`
- Type: `string`

The textual content of the post.

## `socialMediaPost.raw`
- Type: `Object.<string, any>`

Additional raw data about the post returned by an external data source like a web API.

## `socialMediaPost.from?`
- Type: `string`

The ID of the [Channel](../channels/channel.md) that the post came from.

## `socialMediaPost.getTimestamp()`
- Returns: [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Returns the value of the [`socialMediaPost.authoredAt`](#socialMediaPost.authoredAt) field.

# Interface: `SocialMediaOptions`

## `socialMediaOptions.authoredAt`
See [`socialMediaPost.authoredAt`](#socialMediaPost.authoredAt).

## `socialMediaOptions.fetchedAt`
See [`socialMediaPost.fetchedAt`](#socialMediaPost.fetchedAt).

## `socialMediaOptions.author`
See [`socialMediaPost.author`](#socialMediaPost.author).

## `socialMediaOptions.url`
See [`socialMediaPost.url`](#socialMediaPost.url).

## `socialMediaOptions.platform`
See [`socialMediaPost.platform`](#socialMediaPost.platform).

## `socialMediaOptions.platformID`
See [`socialMediaPost.platformID`](#socialMediaPost.platformID).

## `socialMediaOptions.content?`
See [`socialMediaPost.content?`](#socialMediaPost.content?).

## `socialMediaOptions.raw`
See [`socialMediaPost.raw`](#socialMediaPost.raw).

# Enum: `Platform`

A social media platform.

## `Facebook`
- Value: `'facebook'`

## `Instagram`
- Value: `'instagram'`

## `Twitter`
- Value: `'twitter'`