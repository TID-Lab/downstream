import { expect } from 'chai';
import { env } from 'process';
import PaginationChannel from '../../../src/channels/page';
import CrowdTangleChannel, { CrowdTangleOptions } from '../../../src/channels/builtins/crowdtangle/crowdtangle';

class TestCrowdTangleChannel extends CrowdTangleChannel {
  static INTERVAL: number;

  isCrossPlatform: boolean;

  queryParams: { [key: string]: any };

  interval: number;
}

const dashboardToken = env['DASHBOARD_TOKEN'];

// the CrowdTangle API dashboard token
if (!dashboardToken) {
  throw new Error('You must set the `DASHBOARD_TOKEN` environment variable.');
}

const crowdtangleOptions:CrowdTangleOptions = {
  dashboardToken,
};

describe('CrowdTangleChannel', () => {
  let ctChannel:TestCrowdTangleChannel;

  before((done) => {
    ctChannel = new TestCrowdTangleChannel(crowdtangleOptions);
    done();
  });

  it('should extend PaginationChannel', (done) => {
    expect(ctChannel instanceof PaginationChannel).to.be.true;
    done();
  });

  it('should instantiate a new CrowdTangleChannel', (done) => {
    expect(ctChannel.isCrossPlatform).to.be.false;
    expect(ctChannel.queryParams).to.be.a('object');
    expect(ctChannel.interval).to.be.a('number');
    done();
  });

  it('should fetch a page of Reports from the CrowdTangle API', function (done) {
    // increase timeout as needed with a poor Internet connection
    this.timeout(5000);

    ctChannel.fetchPage().then((reports) => {
      expect(Array.isArray(reports)).to.be.true;
      done();
    });
  });
});
