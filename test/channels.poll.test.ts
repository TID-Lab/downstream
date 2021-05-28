import { expect } from 'chai';
import Channel from '../src/channels/channel';
import PollChannel from '../src/channels/poll';

class TestPollChannel extends PollChannel {
  delay: number;

  interval: number;

  timeout!: ReturnType<typeof setTimeout>;

  i: number;

  throwError: boolean;

  constructor() {
    super();

    this.i = 0;
    this.interval = 10;
    this.throwError = false;
  }

  async fetch() {
    if (this.throwError) {
      throw new Error('Foo bar');
    }
    this.i += 1;
    this.enqueue({});
  }

  async poll() {
    await super.poll();
  }
}

describe('PollChannel', () => {
  let pollChannel:TestPollChannel;

  before((done) => {
    pollChannel = new TestPollChannel();
    done();
  });

  it('should extend Channel', (done) => {
    expect(pollChannel instanceof Channel).to.be.true;
    done();
  });

  it('should instantiate a new PollChannel', (done) => {
    expect(pollChannel.interval).to.equal(10);
    expect(pollChannel.delay).to.equal(0);
    done();
  });

  it('should only poll when started', (done) => {
    pollChannel.poll();
    setTimeout(() => {
      expect(pollChannel.started).to.be.false;
      expect(pollChannel.timeout).to.be.undefined;
      expect(pollChannel.i).to.equal(0);
      done();
    }, 20);
  });

  it('should poll several times', (done) => {
    pollChannel.start().then(() => {
      expect(pollChannel.timeout).to.not.be.undefined;
      expect(pollChannel.started).to.be.true;
    });
    setTimeout(() => {
      expect(pollChannel.i).to.equal(2);
      done();
    }, 15);
  });

  it('should stop polling', (done) => {
    pollChannel.stop().then(() => {
      expect(pollChannel.timeout).to.undefined;
      expect(pollChannel.started).to.be.false;
    });
    expect(pollChannel.i).to.be.gte(2);
    done();
  });

  it('should delay the first poll when asked', (done) => {
    pollChannel.i = 0;
    pollChannel.delay = 20;
    pollChannel.start();
    setTimeout(() => {
      expect(pollChannel.i).to.equal(0);
    }, 10);
    setTimeout(() => {
      expect(pollChannel.i).to.be.lte(2);
      done();
    }, 35);
  });

  it('should catch and emit fetch errors', (done) => {
    pollChannel.throwError = true;
    pollChannel.once('error', (err) => {
      expect(err instanceof Error).to.be.true;
      pollChannel.stop().then(done);
    });
    pollChannel.start();
  });
});
