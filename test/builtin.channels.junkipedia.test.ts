import { expect } from 'chai';
import { config as loadEnv } from 'dotenv';
import PageChannel from '../src/channels/page';
import JunkipediaChannel, { JunkipediaOptions } from '../src/builtin/channels/junkipedia/junkipedia';
import SocialMediaPost from '../src/builtin/post';

loadEnv({ path: './test/.env' });

class TestJunkipediaChannel extends JunkipediaChannel {
  isCrossPlatform: boolean;

  queryParams: { [key: string]: any };

  interval: number;

  namespace: string;
}

describe.skip('builtin: JunkipediaChannel', () => {
  let jpChannel:TestJunkipediaChannel;

  before((done) => {
    const apiKey = process.env.JUNKIPEDIA_API_KEY;
    if (!apiKey) {
      throw new Error('You must set the `JUNKIPEDIA_API_KEY` environment variable.');
    }
    const options:JunkipediaOptions = {
      apiKey,
    };
    jpChannel = new TestJunkipediaChannel(options);

    done();
  });

  it('should extend PageChannel', (done) => {
    expect(jpChannel instanceof PageChannel).to.be.true;
    done();
  });

  it('should instantiate a new JunkipediaChannel', (done) => {
    expect(jpChannel.queryParams).to.be.a('object');
    expect(jpChannel.interval).to.be.a('number');
    expect(jpChannel.namespace.startsWith('junkipedia-')).to.be.true;
    done();
  });

  it('should fetch a page of posts from the Junkipedia API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(30000);

    jpChannel.fetchPage().then((posts) => {
      expect(Array.isArray(posts)).to.be.true;
      if (posts.length > 0) {
        expect(posts[0] instanceof SocialMediaPost).to.be.true;
      }
      done();
    });
  });
});
