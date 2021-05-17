import { expect } from 'chai';
import Channel from '../../src/channels/channel';
import PollChannel from '../../src/channels/poll';
import assembleTestReport from '../utils/reports';

class TestPollChannel extends PollChannel {
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

    const report = assembleTestReport();
    report.raw.i = this.i;
    this.i += 1;
    this.enqueue(report);
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

  it('should catch and emit fetch errors', (done) => {
    pollChannel.throwError = true;
    pollChannel.once('error', (err) => {
      expect(err instanceof Error).to.be.true;
      pollChannel.stop().then(done);
    });
    pollChannel.start();
  });
});
