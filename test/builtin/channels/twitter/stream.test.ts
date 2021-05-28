import { expect } from 'chai';
import { config as loadEnv } from 'dotenv';
import Twitter from 'twitter-v2';
import type TwitterStream from 'twitter-v2/build/TwitterStream';
import Channel from '../../../../src/channels/channel';
import TwitterOptions from '../../../../src/builtin/channels/twitter/shared/options';
import TwitterStreamChannel from '../../../../src/builtin/channels/twitter/stream';
import SocialMediaPost from '../../../../src/builtin/post';

loadEnv({ path: './test/.env' });

class TestTwitterStreamChannel extends TwitterStreamChannel {
  twitter: Twitter;

  queryParams: { [key: string]: any };

  stream?: TwitterStream;

  consecutiveErrorCount: number;
}

const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

// the CrowdTangle API dashboard token
if (!consumerKey || !consumerSecret) {
  throw new Error('You must set the `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` environment variables.');
}

const options:TwitterOptions = {
  credentials: { consumerKey, consumerSecret },
};

describe.skip('builtin: TwitterStreamChannel', () => {
  let twChannel:TestTwitterStreamChannel;

  before((done) => {
    twChannel = new TestTwitterStreamChannel(options);
    done();
  });

  it('should extend Channel', (done) => {
    expect(twChannel instanceof Channel).to.be.true;
    done();
  });

  it('should instantiate a new TwitterStreamChannel', (done) => {
    expect(twChannel.twitter instanceof Twitter).to.be.true;
    expect(twChannel.queryParams).to.be.a('object');
    expect(twChannel.consecutiveErrorCount).to.equal(0);
    done();
  });

  // Skip this test if the stream rules are such that posts rarely come in
  it.skip('should stream posts from the Twitter API', function (done) {
  // it('should stream posts from the Twitter API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    twChannel.once('notEmpty', async () => {
      const post = twChannel.dequeue();
      expect(post instanceof SocialMediaPost).to.be.true;

      await twChannel.stop();
      done();
    });

    twChannel.start();
  });
});
