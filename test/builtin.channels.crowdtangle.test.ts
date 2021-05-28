import { expect } from 'chai';
import { config as loadEnv } from 'dotenv';
import PageChannel from '../src/channels/page';
import CrowdTangleChannel, { CrowdTangleOptions } from '../src/builtin/channels/crowdtangle/crowdtangle';
import SocialMediaPost from '../src/builtin/post';

loadEnv({ path: './test/.env' });

class TestCrowdTangleChannel extends CrowdTangleChannel {
  isCrossPlatform: boolean;

  queryParams: { [key: string]: any };

  interval: number;
}

const dashboardToken = process.env.CROWDTANGLE_DASHBOARD_TOKEN;
// the CrowdTangle API dashboard token
if (!dashboardToken) {
  throw new Error('You must set the `CROWDTANGLE_DASHBOARD_TOKEN` environment variable.');
}

const options:CrowdTangleOptions = {
  dashboardToken,
};

describe.skip('builtin: CrowdTangleChannel', () => {
  let ctChannel:TestCrowdTangleChannel;

  before((done) => {
    ctChannel = new TestCrowdTangleChannel(options);
    done();
  });

  it('should extend PageChannel', (done) => {
    expect(ctChannel instanceof PageChannel).to.be.true;
    done();
  });

  it('should instantiate a new CrowdTangleChannel', (done) => {
    expect(ctChannel.isCrossPlatform).to.be.false;
    expect(ctChannel.queryParams).to.be.a('object');
    expect(ctChannel.interval).to.be.a('number');
    done();
  });

  it('should fetch a page of posts from the CrowdTangle API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(10000);

    ctChannel.fetchPage().then((posts) => {
      expect(Array.isArray(posts)).to.be.true;
      if (posts.length > 0) {
        expect(posts[0] instanceof SocialMediaPost).to.be.true;
      }
      done();
    });
  });
});
