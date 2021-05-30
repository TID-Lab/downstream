# Downstream &middot; [![npm version](https://img.shields.io/npm/v/downstream.svg?style=flat)](https://www.npmjs.com/package/downstream) [![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/TID-Lab/downstream/blob/master/LICENSE.txt) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https:/github.com/TID-Lab/downstream/blob/master/CONTRIBUTING.md)

Downstream is a multi-platform and real-time social media aggregation framework.

## Installation

Downstream is released as a [Node.js](nodejs.org/) package on the [npm registry](https://www.npmjs.com/).

**Node.js 12.9** or higher is required to use Downstream in your project.

To install Downstream for your project, run the below command from your terminal:

```
npm install downstream
```

## Usage

1\. Downstream aggregates data via **[Channels](./docs/channels/channel.md)**. Use our **[built-in Channels](./examples#dogs-built-in-channels)** to pull in posts from platforms like Facebook, Instagram, and Twitter, or **[create your own Channels](./examples#fruits-customc-channels)** to easily pull in data from other sources.

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

downstream.start();
```
## Documentation

Our detailed [API documentation](/docs) is available in the `docs/` folder.

## Examples

Several [examples](/examples) are available in the `examples/` folder.

## Contributing

We welcome outside contributions! See our [Contributing Guidelines](/CONTRIBUTING.md) for details.

## License

[GNU GPLv3](/LICENSE.txt)