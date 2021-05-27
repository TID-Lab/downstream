import { expect } from 'chai';
import { config as loadEnv } from 'dotenv';
import Twitter from 'twitter-v2';
import PageChannel from '../../../../src/channels/page';
import TwitterPageChannel, { TwitterPageOptions } from '../../../../src/builtin/channels/twitter/page';
import SocialMediaPost from '../../../../src/builtin/post';

loadEnv({ path: './test/.env' });

class TestTwitterPageChannel extends TwitterPageChannel {
  twitter: Twitter;

  isRecent: boolean;

  queryParams: { [key: string]: any };

  interval: number;
}

const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

// the CrowdTangle API dashboard token
if (!consumerKey || !consumerSecret) {
  throw new Error('You must set the `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` environment variables.');
}

const options:TwitterPageOptions = {
  credentials: { consumerKey, consumerSecret },
  queryParams: {
    query: 'from:jack',
    max_results: 10,
  },
};

describe.skip('TwitterPageChannel', () => {
  let twChannel:TestTwitterPageChannel;

  before((done) => {
    twChannel = new TestTwitterPageChannel(options);
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

  it('should fetch a page of posts from the Twitter API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    twChannel.fetchPage().then((posts) => {
      expect(Array.isArray(posts)).to.be.true;
      if (posts.length > 0) {
        expect(posts[0] instanceof SocialMediaPost).to.be.true;
      }
      done();
    });
  });
});
