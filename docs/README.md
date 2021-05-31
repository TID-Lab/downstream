# Documentation

Welcome to the documentation for the Downstream API. See [`/examples`](/examples) for example code.

## Core API

- [Downstream](./downstream.md)
  - [Hook](./downstream.md#function-hookitem-next)
  - [NextFunction](./downstream.md#function-nextfunction)
- Channels
  - [Channel](./channels/channel.md)
  - [PollChannel](./channels/poll.md)
    - [PollOptions](./channels/poll.md#interface-polloptions)
  - [PageChannel](./channels/page.md)
    - [PageOptions](./channels/page.md#interface-pageoptions)
    - [TimestampedItem](./channels/page.md#interface-timestampeditem)
  - [WebChannel](./channels/web.md)
- [Item](./item.md)

## Built-in API

- Channels
  - CrowdTangle
    - [CrowdTangleChannel](./builtin/channels/crowdtangle/crowdtangle.md)
    - [FacebookCrowdTangleChannel](./builtin/channels/crowdtangle/facebook.md)
    - [InstagramCrowdTangleChannel](./builtin/channels/crowdtangle/instagram.md)
  - Twitter
    - [TwitterPageChannel](./builtin/channels/twitter/page.md)
      - [TwitterPageOptions](./builtin/channels/twitter/page.md#interface-twitterpageoptions)
    - [TwitterStreamChannel](./builtin/channels/twitter/stream.md)
    - [TwitterOptions](./builtin/channels/twitter/shared/options.md)
- [SocialMediaPost](./builtin/post.md)