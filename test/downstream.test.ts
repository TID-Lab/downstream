import { expect } from 'chai';
import Downstream from '../src/downstream';
import Item from '../src/item';
import TestChannel from './utils/channel';

function newItem(from?:string): Item {
  return { from };
}

class TestDownstream extends Downstream {
  channels;

  hookList;

  started;

  counter;

  empty;

  pointer;

  channelErrorListeners;

  channelEmptyListener;

  channelNotEmptyListener;

  disableListeners: boolean;

  callbackCounter: number;

  constructor() {
    super();

    this.disableListeners = false;
    this.callbackCounter = 0;
  }

  onChannelError(id, err) {
    if (!this.disableListeners) {
      super.onChannelError(id, err);
    }
    this.callbackCounter += 1;
  }

  onChannelEmpty() {
    if (!this.disableListeners) {
      super.onChannelEmpty();
    }
    this.callbackCounter += 1;
  }

  onChannelNotEmpty() {
    if (!this.disableListeners) {
      super.onChannelNotEmpty();
    }
    this.callbackCounter += 1;
  }
}

describe('Downstream', () => {
  let downstream:TestDownstream;
  let channel1:TestChannel;
  let channel2:TestChannel;
  let id1:string;
  let id2:string;

  before((done) => {
    downstream = new TestDownstream();
    channel1 = new TestChannel();
    channel2 = new TestChannel();
    done();
  });

  it('should instantiate a new Downstream instance', (done) => {
    expect(downstream.channels).to.be.a('object');
    expect(downstream.channels).to.be.empty;
    expect(downstream.channelErrorListeners).to.be.a('object');
    expect(Array.isArray(downstream.hookList)).to.be.true;
    expect(downstream.hookList).to.be.empty;
    expect(downstream.started).to.be.false;
    expect(downstream.counter).to.equal(0);
    expect(downstream.empty).to.be.true;
    expect(downstream.pointer).to.equal(0);
    done();
  });

  it('should register a Channel', (done) => {
    id1 = downstream.register(channel1);
    expect(downstream.counter).to.equal(1);
    expect(downstream.channels[id1]).to.equal(channel1);
    expect(downstream.channelErrorListeners[id1]).to.be.a('function');
    expect(downstream.channelEmptyListener).to.be.a('function');
    expect(downstream.channelNotEmptyListener).to.be.a('function');

    downstream.disableListeners = true;
    channel1.emit('error');
    channel1.emit('empty');
    channel1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(downstream.callbackCounter).to.equal(3);
            downstream.callbackCounter = 0;
            done();
          },
        ),
      ),
    );
  });

  it('should not register a Channel twice', (done) => {
    expect(downstream.register.bind(downstream, channel1)).to.throw();
    expect(downstream.counter).to.equal(1);
    done();
  });

  it('should return registered Channels', (done) => {
    expect(downstream.channel(id1)).to.equal(channel1);
    done();
  });

  it('should unregister a Channel', (done) => {
    downstream.unregister(id1);

    expect(downstream.channels[id1]).to.be.undefined;
    expect(downstream.channelErrorListeners[id1]).to.be.undefined;
    expect(downstream.channelEmptyListener).to.be.a('function');
    expect(downstream.channelNotEmptyListener).to.be.a('function');

    // emitting the `error` throws an Error with no listeners.
    expect(channel1.emit.bind(channel1, 'error')).to.throw();
    channel1.emit('empty');
    channel1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(downstream.callbackCounter).to.equal(0);
            downstream.callbackCounter = 0;
            downstream.disableListeners = false;
            done();
          },
        ),
      ),
    );
  });

  it('should throw an error when unregistering fails', (done) => {
    expect(downstream.unregister.bind(downstream, id1)).to.throw();
    done();
  });

  it('should start registered Channels on start', (done) => {
    id1 = downstream.register(channel1);
    id2 = downstream.register(channel2);
    downstream.start().then(() => {
      expect(downstream.started).to.be.true;
      expect(channel1.started).to.be.true;
      expect(channel2.started).to.be.true;
      done();
    });
  });

  it('should stop registered Channels on stop', (done) => {
    downstream.stop().then(() => {
      expect(downstream.started).to.be.false;
      expect(channel1.started).to.be.false;
      expect(channel2.started).to.be.false;
      done();
    });
  });

  it('should reset itself on start', (done) => {
    downstream.pointer = 5;
    downstream.empty = false;
    downstream.start().then(() => {
      expect(downstream.started).to.be.true;
      expect(downstream.pointer).to.equal(0);
      expect(downstream.empty).to.be.true;
      downstream.stop().then(done);
    });
  });

  it('should handle Channel start errors gracefully', (done) => {
    channel2.throwError = true;
    downstream.once('error', (err, id) => {
      expect(err instanceof Error).to.be.true;
      expect(id.toString()).to.equal(id2.toString());
      channel2.throwError = false;
      downstream.stop().then(done);
    });
    downstream.start();
  });

  it('should handle Channel stop errors gracefully', (done) => {
    downstream.start().then(() => {
      channel2.throwError = true;
      downstream.once('error', (err, id) => {
        expect(err instanceof Error).to.be.true;
        expect(id.toString()).to.equal(id2.toString());
        channel2.throwError = false;
        done();
      });
      downstream.stop();
    });
  });

  it('should use hooks', (done) => {
    const item = newItem();
    async function hook(_, next) {
      downstream.hookList = [];
      await downstream.stop();

      done();

      await next();
    }
    downstream.use(hook);
    downstream.start().then(() => {
      channel1.enqueue(item);
    });
  });

  it('should tag outgoing items with a Channel ID', (done) => {
    const item = newItem();
    let firstItem = true;
    async function hook(i, next) {
      if (firstItem) {
        expect(i.from).to.equal(id1.toString());
        firstItem = false;
        await next();
        return;
      }
      expect(i.from).to.equal(id2.toString());
      downstream.hookList = [];
      await downstream.stop();
      await next();
      done();
    }
    downstream.use(hook);
    downstream.start().then(() => {
      channel1.enqueue({ ...item });
      channel2.enqueue({ ...item });
    });
  });

  it('should grab items from each Channel one at a time', (done) => {
    const items = [];
    let string = '';
    let i = 0;
    async function hook(r, next) {
      string += r.content;
      i += 1;
      if (i < 4) {
        await next();
        return;
      }
      expect(string).to.equal('1324');
      downstream.hookList = [];
      await downstream.stop();
      await next();
      done();
    }
    for (let j = 0; j < 4; j += 1) {
      items.push({
        ...newItem(),
        content: (j + 1).toString(),
      });
    }
    downstream.use(hook);
    downstream.start().then(() => {
      channel1.enqueue(items.shift());
      channel1.enqueue(items.shift());
      channel2.enqueue(items.shift());
      channel2.enqueue(items.shift());
    });
  });

  it('should run hooks in the order used', (done) => {
    const item = newItem();
    let string = '';
    async function hook1(r, next) {
      string += '1';
      await next();
    }
    async function hook2(r, next) {
      string += '2';
      expect(string).to.equal('12');
      downstream.hookList = [];
      await downstream.stop();
      await next();
      done();
    }
    downstream.use(hook1);
    downstream.use(hook2);
    downstream.start().then(() => {
      channel1.enqueue({ ...item });
    });
  });
});
