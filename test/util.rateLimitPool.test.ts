import { expect } from 'chai';
import RateLimitPool from '../src/util/rateLimitPool';
import TestPollChannel from './utils/pollChannel';

class TestRateLimitPool extends RateLimitPool {
  interval: number;

  pollChannels: TestPollChannel[];

  pointer: number;

  timeout?:ReturnType<typeof setTimeout>;

  stopTimestamp?: Date;

  i: number;

  constructor(options) {
    super(options);

    this.i = 0;
  }

  poll(): Promise<void> {
    this.i += 1;
    return super.poll();
  }

  clear(): void {
    for (let i = this.pollChannels.length - 1; i >= 0; i -= 1) {
      this.remove(this.pollChannels[i]);
    }
  }
}

describe('RateLimitPool', () => {
  let rateLimitPool:TestRateLimitPool;
  let pollChannel:TestPollChannel;

  before((done) => {
    rateLimitPool = new TestRateLimitPool({ interval: 10 });
    done();
  });

  it('should instantiate a new RateLimitPool', (done) => {
    expect(rateLimitPool.interval).to.equal(10);
    expect(Array.isArray(rateLimitPool.pollChannels)).to.be.true;
    expect(rateLimitPool.pollChannels).to.be.empty;
    expect(rateLimitPool.pointer).to.equal(0);
    done();
  });

  it('should only poll when it has PollChannels', (done) => {
    rateLimitPool.poll();
    setTimeout(() => {
      expect(rateLimitPool.timeout).to.be.undefined;
      expect(rateLimitPool.pointer).to.equal(0);
      done();
    }, 20);
  });

  it('should start polling when a PollChannel is added', (done) => {
    pollChannel = new TestPollChannel({ namespace: 'foo' });
    rateLimitPool.add(pollChannel);
    expect(rateLimitPool.pollChannels[0]).to.equal(pollChannel);
    setTimeout(() => {
      expect(rateLimitPool.i).to.equal(2);
      done();
    }, 10);
  });

  it('should throw an error when a duplicate PollChannel is added', (done) => {
    expect(rateLimitPool.add.bind(rateLimitPool, pollChannel)).to.throw;
    done();
  });

  it('should poll at a regular interval with many PollChannels', (done) => {
    rateLimitPool.i = 0;
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    rateLimitPool.add(new TestPollChannel({ namespace: 'foo' }));
    setTimeout(() => {
      expect(rateLimitPool.i).to.be.lte(2);
      done();
    }, 15);
  });

  it('should stop polling when it has no more PollChannels', (done) => {
    rateLimitPool.clear();
    expect(rateLimitPool.stopTimestamp instanceof Date).to.be.true;
    expect(pollChannel.timeout).to.undefined;
    done();
  });

  it('should throw an error when a non-active PollChannel is removed', (done) => {
    expect(rateLimitPool.remove.bind(rateLimitPool, pollChannel)).to.throw;
    done();
  });

  it('should wait on restart to poll only after its interval has passed', (done) => {
    rateLimitPool.i = 0;
    rateLimitPool.interval = 30;
    rateLimitPool.add(pollChannel);
    setTimeout(() => {
      expect(rateLimitPool.i).to.equal(0);
    }, 15);
    setTimeout(() => {
      expect(rateLimitPool.i).to.equal(1);
      done();
    }, 40);
  });

  it('should catch and emit fetch errors', (done) => {
    pollChannel.throwError = true;
    pollChannel.once('error', (err) => {
      expect(err instanceof Error).to.be.true;
      rateLimitPool.clear();
      done();
    });
  });
});
