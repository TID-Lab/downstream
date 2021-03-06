import { expect } from 'chai';
import { config as loadEnv } from 'dotenv';
import Twitter from 'twitter-v2';
import type TwitterStream from 'twitter-v2/build/TwitterStream';
import Channel from '../src/channels/channel';
import TwitterOptions from '../src/builtin/channels/twitter/shared/options';
import TwitterStreamChannel from '../src/builtin/channels/twitter/stream';
import SocialMediaPost from '../src/builtin/post';

loadEnv({ path: './test/.env' });

class TestTwitterStreamChannel extends TwitterStreamChannel {
  twitter: Twitter;

  queryParams: { [key: string]: any };

  stream?: TwitterStream;

  consecutiveErrorCount: number;
}

describe.skip('builtin: TwitterStreamChannel', () => {
  let twChannel:TestTwitterStreamChannel;

  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

  const options:TwitterOptions = {
    credentials: { consumerKey, consumerSecret },
  };

  before((done) => {
    twChannel = new TestTwitterStreamChannel(options);

    if (!consumerKey || !consumerSecret) {
      throw new Error('You must set the `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` environment variables.');
    }

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

  it('should stream posts from the Twitter API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    async function configureRules() {
      // get the old rules
      const ruleIds = (
        await twChannel.getStreamRules()
      ).map(({ id }) => id);

      // delete old rules
      await twChannel.updateStreamRules({ delete: { ids: ruleIds } });

      // add a rule that'll stream posts like crazy
      await twChannel.updateStreamRules({
        add: [
          { value: 'dogs', tag: 'doggos' },
        ],
      });
    }

    configureRules().then(() => {
      twChannel.once('notEmpty', async () => {
        const post = twChannel.dequeue();
        expect(post instanceof SocialMediaPost).to.be.true;

        await twChannel.stop();
        done();
      });

      twChannel.start();
    });
  });
});
