# Downstream &middot; [![npm version](https://img.shields.io/npm/v/downstream.svg?style=flat)](https://www.npmjs.com/package/downstream) [![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/TID-Lab/downstream/blob/master/LICENSE.txt) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https:/github.com/TID-Lab/downstream/blob/master/CONTRIBUTING.md)

Downstream is a multi-platform and real-time social media aggregation framework developed and maintained by the [Technologies & International Development](http://tid.gatech.edu/) (T+ID) Lab at Georgia Tech.

## Installation

Downstream built in TypeScript and is released as a [Node.js](nodejs.org/) package on the [npm registry](https://www.npmjs.com/).

**Node.js 12.9** or higher is required to use Downstream in your project.

To install Downstream for your project, run the below command from your terminal:

```
npm install downstream
```

## Usage

```javascript
// channel.js

const { builtin } = require('downstream');
const { TwitterStreamChannel } = builtin;

const credentials = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
}

module.exports = new TwitterStreamChannel({ credentials });
```

```javascript
// middleware.js

module.exports = async function logMiddleware(post, next) {
  console.log(post);
  await next();
}
```

```javascript
// main.js

const { Downstream } = require('downstream');
const twitterChannel = require('./channel');
const logMiddleware = require('./middleware');

const downstream = new Downstream();

downstream.register(twitterChannel);
downstream.use(logMiddleware);

downstream.start();
```

## Examples

Several [examples](/examples) are available in the `examples/` folder.

## Documentation

Our detailed [API documentation](/docs/API.md) is available in the `docs/` folder.

## Contributing

We welcome outside contributions! See [CONTRIBUTING.md](/CONTRIBUTING.md) for details.

## License

[GNU GPLv3](/LICENSE.txt)