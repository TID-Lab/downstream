# Downstream &middot; [![npm version](https://img.shields.io/npm/v/downstream.svg?style=flat)](https://www.npmjs.com/package/downstream) [![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/TID-Lab/downstream/blob/master/LICENSE.txt) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https:/github.com/TID-Lab/downstream/blob/master/CONTRIBUTING.md)

Downstream is a multi-platform and real-time social media aggregation framework.

## Installation

Downstream is released as a [Node.js](https://nodejs.org/) package on the [npm registry](https://www.npmjs.com/).

**Node.js 12.9** or higher is required to use Downstream in your project.

To install Downstream for your project, run the below command from your terminal:

```
npm install downstream
```

## Usage

1\. Downstream aggregates data via **[Channels](./docs/channels/channel.md)**.

- **[Built-in Channels](./examples#2-built-in-channels)** aggregate posts from platforms like Facebook, Instagram, or Twitter.
- **[Create your own Channels](./examples#3-custom-channels)** to easily aggregate data from other platforms and sources.
- **[Use a WebChannel](./examples#6-using-a-webchannel)** to expose Downstream on your local network or string multiple Downstream instances together via a simple HTTP interface.

```javascript
// channels.js

const { builtin } = require('downstream');
const { TwitterStreamChannel } = builtin;

const credentials = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
}

const twitterChannel = new TwitterStreamChannel({ credentials });

module.exports = { twitterChannel };
```

2\. Access and mutate your aggregated data via **[hooks](./docs/downstream.md#Function-Hook(item,-next))**.

```javascript
// hooks.js

async function logHook(post, next) {
  console.log(post);
  await next();
}

module.exports = { logHook };
```

3\. Initialize and start a **[new Downstream instance](./docs/downstream.md)**.

```javascript
// main.js

const { Downstream } = require('downstream');
const { twitterChannel } = require('./channels');
const { logHook } = require('./hooks');

const downstream = new Downstream();

// register Channels
downstream.register(twitterChannel);

// use hooks
downstream.use(logHook);

// log any errors
downstream.on('error', console.log);

downstream.start();
```
## Documentation

Our detailed [API documentation](/docs) is available in the `docs/` folder.

## Examples

Several [examples](/examples) are available in the `examples/` folder.

## Contributing

See our [Contributing Guidelines](/CONTRIBUTING.md) for details. We welcome outside contributions!

## People

Downstream is actively built and maintained by the [Technologies & International Development](http://tid.gatech.edu/) (T+ID) Lab at Georgia Tech to support the [Aggie platform](https://github.com/tid-lab/aggie) and other research initiatives.

This project would not be possible without the amazing work done by the original contributors to the [Aggie platform](https://github.com/tid-lab/aggie) whose work on the original backend for Aggie inspired the idea and architecture behind Downstream. Thank you.

## License

[GNU GPLv3](/LICENSE.txt)
