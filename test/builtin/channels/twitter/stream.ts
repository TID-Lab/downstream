import { expect } from 'chai';
import { env } from 'process';
import Twitter from 'twitter-v2';
import type TwitterStream from 'twitter-v2/build/TwitterStream';
import Channel from '../../../../src/channels/channel';
import TwitterStreamChannel, { TwitterStreamOptions } from '../../../../src/builtin/channels/twitter/stream';

class TestTwitterStreamChannel extends TwitterStreamChannel {
  twitter: Twitter;

  queryParams: { [key: string]: any };

  stream?: TwitterStream;

  consecutiveErrorCount: number;
}

const consumerKey = env['CONSUMER_KEY'];
const consumerSecret = env['CONSUMER_SECRET'];

// the CrowdTangle API dashboard token
if (!consumerKey || !consumerSecret) {
  throw new Error('You must set the `CONSUMER_KEY` and `CONSUMER_SECRET` environment variables.');
}

const twitterStreamOptions:TwitterStreamOptions = {
  credentials: { consumerKey, consumerSecret },
};

describe('TwitterStreamChannel', () => {
  let twChannel:TestTwitterStreamChannel;

  before((done) => {
    twChannel = new TestTwitterStreamChannel(twitterStreamOptions);
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

  it('should stream Reports from the Twitter API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    twChannel.once('notEmpty', async () => {
      const report = twChannel.dequeue();
      expect(report).to.be.a('object');

      await twChannel.stop();
      done();
    });

    twChannel.start();
  });
});