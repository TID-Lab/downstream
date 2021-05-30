# Class: `InstagramCrowdTangleChannel`

- extends [`CrowdTangleChannel`](./crowdtangle.md)

A built-in [Channel](../../../channels/channel.md) for aggregating Instagram posts as [SocialMediaPosts](../../post.md).

This [Channel](../../../channels/channel.md) is functionally equivalent to a [CrowdTangleChannel](./crowdtangle.md) with the exception that it just aggregates posts from Instagram and no other platform.


## `InstagramCrowdTangleChannel(options)`

- `options`: [CrowdTangleOptions](./crowdtangle.md#interface-crowdtangleoptions)

Initializes a new InstagramCrowdTangleChannel.

```javascript
const { builtin } = require('downstream');
const { InstagramCrowdTangleChannel } = builtin;

const instagramChannel = new InstagramCrowdTangleChannel({

  // an Instagram Dashboard Token
  dashboardToken: process.env.CROWDTANGLE_DASHBOARD_TOKEN

});
```

Visit the section on [CrowdTangleOptions](./crowdtangle.md#interface-crowdtangleoptions) below to learn about configuration.