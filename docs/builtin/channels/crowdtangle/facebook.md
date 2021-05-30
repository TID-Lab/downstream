# Class: `FacebookCrowdTangleChannel`

- extends [`CrowdTangleChannel`](./crowdtangle.md)

A built-in [Channel](../../../channels/channel.md) for aggregating Facebook posts as [SocialMediaPosts](../../post.md).

This [Channel](../../../channels/channel.md) is functionally equivalent to a [CrowdTangleChannel](./crowdtangle.md) with the exception that it just aggregates posts from Facebook and no other platform.


## `FacebookCrowdTangleChannel(options)`

- `options`: [CrowdTangleOptions](./crowdtangle.md#interface-crowdtangleoptions)

Initializes a new FacebookCrowdTangleChannel.

```javascript
const { builtin } = require('downstream');
const { FacebookCrowdTangleChannel } = builtin;

const facebookChannel = new FacebookCrowdTangleChannel({

  // a Facebook Dashboard Token
  dashboardToken: process.env.CROWDTANGLE_DASHBOARD_TOKEN

});
```

Visit the section on [CrowdTangleOptions](./crowdtangle.md#interface-crowdtangleoptions) below to learn about configuration.