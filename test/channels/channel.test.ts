import { expect } from 'chai';
import CircularQueue from '../../src/queue';
import Channel from '../../src/channels/channel';

describe('Channel', () => {
  let channel;

  before((done) => {
    channel = new Channel();
    done();
  });

  it('should instantiate a new Channel', (done) => {
    expect(channel.started).to.be.false;
    expect(channel.queue instanceof CircularQueue).to.be.true;
    done();
  });

  it('should start', (done) => {
    channel.start().then(() => {
      expect(channel.started).to.be.true;
      done();
    });
  });

  it('should stop', (done) => {
    channel.stop().then(() => {
      expect(channel.started).to.be.false;
      done();
    });
  });

  it('should enqueue a Report', (done) => {
    function callback() {
      expect(channel.isEmpty()).to.be.false;

      channel.removeListener('notEmpty', callback);
      done();
    }
    channel.on('notEmpty', callback);
    channel.enqueue({ foo: 'bar' });
  });

  it('should dequeue a Report', (done) => {
    function callback() {
      expect(channel.isEmpty()).to.be.true;

      channel.removeListener('empty', callback);
      done();
    }
    channel.on('empty', callback);

    const report = channel.dequeue();
    expect(report.foo).to.equal('bar');
    expect(channel.dequeue()).to.be.null;
  });
});
