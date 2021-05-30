# Examples

## Running an example

1. Clone this repository to your computer
```bash
git clone https://github.com/TID-Lab/downstream
```
2. `cd` into the example folder you want to run
1. Run `npm install` in the folder to install example dependencies
1. Set the necessary environment variables, if required.
1. Run `node index.js` in the folder to run the example

## 1. [Basic](./basic)

Logs each item from a Channel to the console.

**This example demonstrates:**

- Writing your first Hook
- Registering your first Channel
- Running Downstream for the first time

## 2. [Built-in Channels](./dogs)

Uses every built-in Channel available to aggregate social media posts about dogs across Facebook, Instagram, and Twitter.

**This example demonstrates:**

- Using the built-in Channels for Facebook, Instagram, and Twitter

To run this example, you'll need to set the following environment variables to securely pass in API keys and secrets:

- `FACEBOOK_DASHBOARD_TOKEN` - a CrowdTangle Facebook dashboard token
- `INSTAGRAM_DASHBOARD_TOKEN` - a CrowdTangle Instagram dashboard token
- `TWITTER_CONSUMER_KEY` - a Twitter v2 API consumer key
- `TWITTER_CONSUMER_SECRET`- a Twitter v2 API consumer secret

If you do not possess any of the secrets or keys listed above, you can simply comment out the corresponding channel, as well as the line that registers it with Downstream.

## 3. [Custom Channels](./fruits)

Uses a custom Channel to aggregate data from a custom fruit API.

**This example demonstrates:**

- Writing your own Channel
- Aggregating data from your own Channel

## 4. [Mutating data with hooks](./translator)

Annotates the sentences of each item with their language.

**This example demonstrates:**

- Using multiple hooks
- Mutating items in your hook
- Writing your own Channel

## 5. [Saving aggregated data to a database](./cats)

An example that saves tweets about cats to your local MongoDB database.

**This example demonstrates:**

- Saving aggregated data to a database

To run this example, you'll need to set the following environment variables to securely pass in API keys and secrets:

- `TWITTER_CONSUMER_KEY` - a Twitter v2 API consumer key
- `TWITTER_CONSUMER_SECRET`- a Twitter v2 API consumer secret
