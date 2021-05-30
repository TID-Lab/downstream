# Documentation

Welcome to the documentation for the Downstream API. See [`/examples`](/examples) for example code.

## Core API

- [Downstream](./downstream.md)
  - [Hook](./downstream.md#Function-Hook(item,-next))
  - [NextFunction](./downstream.md#Function-NextFunction())
- Channels
  - [Channel](./channels/channel.md)
  - [PollChannel](./channels/poll.md)
    - [PollOptions](./channels/poll.md#Interface-PollOptions)
  - [PageChannel](./channels/page.md)
    - [PageOptions](./channels/page.md#Interface-PageOptions)
    - [TimestampedItem](./channels/page.md#Interface-TimestampedItem)
- [Item](./item.md)

## Built-in API

- Channels
  - CrowdTangle
    - [CrowdTangleChannel](./builtin/channels/crowdtangle/crowdtangle.md)
    - [FacebookCrowdTangleChannel](./builtin/channels/crowdtangle/facebook.md)
    - [InstagramCrowdTangleChannel](./builtin/channels/crowdtangle/instagram.md)
  - Twitter
    - [TwitterPageChannel](./builtin/channels/twitter/page.md)
      - [TwitterPageOptions](./builtin/channels/twitter/page.md#Interface-TwitterPageOptions)
    - [TwitterStreamChannel](./builtin/channels/twitter/stream.md)
    - [TwitterOptions](./builtin/channels/twitter/shared/options.md)
- [SocialMediaPost](./builtin/post.md)