# Class: `CrowdTangleChannel`

- extends [`PageChannel`](../../../channels/page.md)

A built-in [Channel](../../../channels/channel.md) for aggregating posts as [SocialMediaPosts](../../post.md) from social media platforms supported by the CrowdTangle API.

By default, this [Channel](../../../channels/channel.md) works by paginating by timestamp through posts returned by the CrowdTangle API family of `/post` endpoints. Read below for specifics which endpoint are used when. If no initial timestamp is provided, then this [Channel](../../../channels/channel.md) sets the timestamp to three hours ago and begins paginating posts authored from then on. As new posts are returned by the API, this Channel leverages its underlying [PageChannel](../../../channels/page.md) architecture to catch up page-by-page to the posts being authored in the present.

Platform-specific CrowdTangle [Channels](../../../channels/channel.md) are also available for [Facebook](./facebook.md) and [Instagram](./instagram.md). The difference between this [Channel](../../../channels/channel.md) and the platform-specific ones is that the latter are locked to their specific platform by design. Meanwhile, the primary purpose of this [Channel](../../../channels/channel.md) is to dynamically aggregate post data across multiple CrowdTangle-supported platforms.

**Note: A built-in CrowdTangle [Channel](../../../channels/channel.md) for Reddit is not implemented because the authors do not yet have CrowdTangle access to Reddit in order to test it for release.** If you do have Reddit access and would like to see a built-in [Channel](../../../channels/channel.md) added, please open a Pull Request! See our **[Contributing Guidelines](../../../../CONTRIBUTING.md)** for more.

## `CrowdTangleChannel(options)`

- `options`: [CrowdTangleOptions](#interface-crowdtangleoptions)

Initializes a new CrowdTangleChannel.

```javascript
const { builtin } = require('downstream');
const { CrowdTangleChannel } = builtin;

const crowdtangleChannel = new CrowdTangleChannel({

  dashboardToken: process.env.CROWDTANGLE_DASHBOARD_TOKEN

});
```

Visit the section on [CrowdTangleOptions](#interface-crowdtangleoptions) below to learn about configuration.

# Interface: `CrowdTangleOptions`
- extends [`PageOptions`](../../../channels/page.md#interface-pageoptions)

## `crowdtangleOptions.dashboardToken`
- Type: `string`

A CrowdTangle Dashboard Token required for access to the CrowdTangle API.

## `crowdtangleOptions.isCrossPlatform?`
- Type: `boolean`
- Default: `false`

Whether to aggregate social media posts from across an entire platform or to limit your data source to posts authored by the accounts contained in your Dashboard's CrowdTangle Lists.

For those familiar with the CrowdTangle API, the following values for this property correspond to the use of two separate endpoints:

| `isCrossPlatform` | API Endpoint  |
| ----------------- | ------------- |
| `false`           | /posts        |
| `true`            | /posts/search |

## `crowdtangleOptions.queryParams?`

- Type: `Object.<string, string>`

The query parameters passed to the CrowdTangle API on each call to the endpoints above. Visit the [CrowdTangle API Wiki](https://github.com/CrowdTangle/API/wiki) to learn more about what query parameters are available. Several of these parameters have provided defaults that you can easily override:

| Query parameter | Default value  |
| ----------------- | ------------- |
| `sortBy`           | `'date'`       |
| `language`            | `'en'` |
| `count`            | `100` |

## `crowdtangleOptions.nextPageURL?`

- Type: `string`

An optional most recent "next page" URL returned by the CrowdTangle API to start paginating from where this [CrowdTangleChannel](#class-crowdtanglechannel) might have last left off.

CrowdTangle API endpoints that support pagination return a helpful "next page" URL that indicates what URL to point to next in order to fetch the next page of data.

## `crowdtangleOptions.namespace?`
- Type: `string`
- Default: `crowdtangle`