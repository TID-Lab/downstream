/* eslint-disable no-new */
import { expect } from 'chai';
import Channel from '../src/channels/channel';
import TestPollChannel from './utils/pollChannel';

describe('PollChannel', () => {
  let pollChannel:TestPollChannel;
  let pollChannel1:TestPollChannel;

  before((done) => {
    pollChannel = new TestPollChannel({ namespace: 'foo' });
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

  it('should throw an error when not using a namespace', (done) => {
    let error;
    try {
      new TestPollChannel({});
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    done();
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

  it('should poll independently from PollChannels with different namespaces', (done) => {
    pollChannel.i = 0;
    pollChannel1 = new TestPollChannel({ namespace: 'bar' });
    pollChannel1.start();
    setTimeout(() => {
      expect(pollChannel1.i).to.equal(2);
      done();
    }, 15);
  });

  it('should stop polling', (done) => {
    expect(pollChannel.i).to.be.gte(2);
    pollChannel.stop().then(async () => {
      expect(pollChannel.timeout).to.undefined;
      expect(pollChannel.started).to.be.false;
      await pollChannel1.stop();
      done();
    });
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
