# Downstream &middot; [![npm version](https://img.shields.io/npm/v/downstream.svg?style=flat)](https://www.npmjs.com/package/downstream) [![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/TID-Lab/downstream/blob/master/LICENSE.txt) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https:/github.com/TID-Lab/downstream/blob/master/CONTRIBUTING.md)

Downstream is a multi-platform and real-time social media aggregation framework. It not only offers built-in support for streaming from major social media platforms including **Facebook**, **Instagram**, and **Twitter**, but also exposes a set of helpful primitive classes that you can extend to leverage Downstream for virtually any platform or use case.

Downstream is actively built and maintained by the [Technologies & International Development](http://tid.gatech.edu/) (TID) Lab at Georgia Tech to support the [Aggie platform](https://github.com/tid-lab/aggie) and other research initiatives. We update this package regularly to support the latest changes to the APIs exposed by each major platform. [Contributions](#CONTRIBUTING) are invited and welcome.

## Installation

Downstream built in TypeScript and is released as a [Node.js](nodejs.org/) package on the [npm registry](https://www.npmjs.com/).

**Node.js 12.9** or higher is required to use Downstream in your project.

To install Downstream for your project, run the below command from your terminal:

```
npm install downstream
```

## Usage

Downstream operates by listening to a set of [Channels](/docs/API.md#TODO) that feed objects (ie. social media posts) into a central stream. Each object in the stream is passed to a series of functions (called ["middleware"](/docs/API.md#TODO)) that can mutate the object.

```javascript
const { Downstream, builtins } = require('downstream');
const { TwitterStreamChannel } = builtins;

const downstream = new Downstream(); // initialize Downstream


async function flagMiddleware(tweet, next) {
  tweet.flag = true; // adds a flag to each Tweet
  await next();
}

async function logMiddleware(tweet, next) {
  console.log(tweet); // logs each Tweet to the console
  await next();
}

downstream.use(flagMiddleware);
downstream.use(logMiddleware);

const twitterChannel = new TwitterStreamChannel({

  // for Twitter API access
  credentials: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  }

});

downstream.register(twitterChannel);

downstream.start(); // starts streaming Tweets
```

## Examples

Several [examples](/examples) are available in the `examples/` folder.

## Documentation

Our detailed [API documentation](/docs/API.md) is available in the `docs/` folder.

## Contributing

We welcome outside contributions! See [CONTRIBUTING.md](/CONTRIBUTING.md) for details.

## License

[GNU GPLv3](/LICENSE.txt)