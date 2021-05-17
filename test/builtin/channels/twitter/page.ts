import { expect } from 'chai';
import { env } from 'process';
import Twitter from 'twitter-v2';
import PageChannel from '../../../../src/channels/page';
import TwitterPageChannel, { TwitterPageOptions } from '../../../../src/builtin/channels/twitter/page';

class TestTwitterPageChannel extends TwitterPageChannel {
  twitter: Twitter;

  isRecent: boolean;

  queryParams: { [key: string]: any };

  interval: number;
}

const consumerKey = env['CONSUMER_KEY'];
const consumerSecret = env['CONSUMER_SECRET'];

// the CrowdTangle API dashboard token
if (!consumerKey || !consumerSecret) {
  throw new Error('You must set the `CONSUMER_KEY` and `CONSUMER_SECRET` environment variables.');
}

const twitterPageOptions:TwitterPageOptions = {
  credentials: { consumerKey, consumerSecret },
  queryParams: {
    query: 'from:jack',
    max_results: 10,
  },
};

describe('TwitterPageChannel', () => {
  let twChannel:TestTwitterPageChannel;

  before((done) => {
    twChannel = new TestTwitterPageChannel(twitterPageOptions);
    done();
  });

  it('should extend PageChannel', (done) => {
    expect(twChannel instanceof PageChannel).to.be.true;
    done();
  });

  it('should instantiate a new TwitterPageChannel', (done) => {
    expect(twChannel.twitter instanceof Twitter).to.be.true;
    expect(twChannel.isRecent).to.be.false;
    expect(twChannel.queryParams).to.be.a('object');
    expect(twChannel.interval).to.be.a('number');
    done();
  });

  it('should fetch a page of Reports from the Twitter API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    twChannel.fetchPage().then((reports) => {
      expect(Array.isArray(reports)).to.be.true;
      done();
    });
  });
});
