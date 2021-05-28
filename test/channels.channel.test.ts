import { expect } from 'chai';
import CircularQueue from '../src/queue';
import Channel from '../src/channels/channel';

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

  it('should enqueue an item', (done) => {
    channel.once('notEmpty', () => {
      expect(channel.isEmpty()).to.be.false;
      done();
    });
    channel.enqueue({ foo: 'bar' });
  });

  it('should dequeue an item', (done) => {
    channel.once('empty', () => {
      expect(channel.isEmpty()).to.be.true;
      done();
    });

    const item = channel.dequeue();
    expect(item.foo).to.equal('bar');
    expect(channel.dequeue()).to.be.null;
  });
});
