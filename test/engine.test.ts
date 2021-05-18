import { expect } from 'chai';
import Engine from '../src/engine';
import Item from '../src/item';
import TestChannel from './utils/channel';

function newItem(from?:string): Item {
  return { from };
}

class TestEngine extends Engine {
  channels;

  middlewareList;

  middleware;

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

describe('Engine', () => {
  let engine:TestEngine;
  let channel1:TestChannel;
  let channel2:TestChannel;
  let id1:string;
  let id2:string;

  before((done) => {
    engine = new TestEngine();
    channel1 = new TestChannel();
    channel2 = new TestChannel();
    done();
  });

  it('should instantiate a new Engine', (done) => {
    expect(engine.channels).to.be.a('object');
    expect(engine.channels).to.be.empty;
    expect(engine.channelErrorListeners).to.be.a('object');
    expect(Array.isArray(engine.middlewareList)).to.be.true;
    expect(engine.middlewareList).to.be.empty;
    expect(engine.started).to.be.false;
    expect(engine.counter).to.equal(0);
    expect(engine.empty).to.be.true;
    expect(engine.pointer).to.equal(0);
    done();
  });

  it('should register a Channel', (done) => {
    id1 = engine.register(channel1);
    expect(engine.counter).to.equal(1);
    expect(engine.channels[id1]).to.equal(channel1);
    expect(engine.channelErrorListeners[id1]).to.be.a('function');
    expect(engine.channelEmptyListener).to.be.a('function');
    expect(engine.channelNotEmptyListener).to.be.a('function');

    engine.disableListeners = true;
    channel1.emit('error');
    channel1.emit('empty');
    channel1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(engine.callbackCounter).to.equal(3);
            engine.callbackCounter = 0;
            done();
          },
        ),
      ),
    );
  });

  it('should not register a Channel twice', (done) => {
    expect(engine.register.bind(engine, channel1)).to.throw();
    expect(engine.counter).to.equal(1);
    done();
  });

  it('should return registered Channels', (done) => {
    expect(engine.channel(id1)).to.equal(channel1);
    done();
  });

  it('should unregister a Channel', (done) => {
    engine.unregister(id1);

    expect(engine.channels[id1]).to.be.undefined;
    expect(engine.channelErrorListeners[id1]).to.be.undefined;
    expect(engine.channelEmptyListener).to.be.a('function');
    expect(engine.channelNotEmptyListener).to.be.a('function');

    // emitting the `error` throws an Error with no listeners.
    expect(channel1.emit.bind(channel1, 'error')).to.throw();
    channel1.emit('empty');
    channel1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(engine.callbackCounter).to.equal(0);
            engine.callbackCounter = 0;
            engine.disableListeners = false;
            done();
          },
        ),
      ),
    );
  });

  it('should throw an error when unregistering fails', (done) => {
    expect(engine.unregister.bind(engine, id1)).to.throw();
    done();
  });

  it('should start registered Channels on start', (done) => {
    id1 = engine.register(channel1);
    id2 = engine.register(channel2);
    engine.start().then(() => {
      expect(engine.started).to.be.true;
      expect(channel1.started).to.be.true;
      expect(channel2.started).to.be.true;
      done();
    });
  });

  it('should stop registered Channels on stop', (done) => {
    engine.stop().then(() => {
      expect(engine.started).to.be.false;
      expect(channel1.started).to.be.false;
      expect(channel2.started).to.be.false;
      done();
    });
  });

  it('should reset itself on start', (done) => {
    engine.pointer = 5;
    engine.empty = false;
    engine.start().then(() => {
      expect(engine.started).to.be.true;
      expect(engine.pointer).to.equal(0);
      expect(engine.empty).to.be.true;
      engine.stop().then(done);
    });
  });

  it('should handle Channel start errors gracefully', (done) => {
    channel2.throwError = true;
    engine.once('error', (err, id) => {
      expect(err instanceof Error).to.be.true;
      expect(id.toString()).to.equal(id2.toString());
      channel2.throwError = false;
      engine.stop().then(done);
    });
    engine.start();
  });

  it('should handle Channel stop errors gracefully', (done) => {
    engine.start().then(() => {
      channel2.throwError = true;
      engine.once('error', (err, id) => {
        expect(err instanceof Error).to.be.true;
        expect(id.toString()).to.equal(id2.toString());
        channel2.throwError = false;
        done();
      });
      engine.stop();
    });
  });

  it('should use middleware', (done) => {
    const item = newItem();
    async function middleware(_, next) {
      engine.middlewareList = [];
      await engine.stop();

      done();

      await next();
    }
    engine.use(middleware);
    engine.start().then(() => {
      channel1.enqueue(item);
    });
  });

  it('should tag outgoing items with a Channel ID', (done) => {
    const item = newItem();
    let firstItem = true;
    async function middleware(i, next) {
      if (firstItem) {
        expect(i.from).to.equal(id1.toString());
        firstItem = false;
        await next();
        return;
      }
      expect(i.from).to.equal(id2.toString());
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    engine.use(middleware);
    engine.start().then(() => {
      channel1.enqueue({ ...item });
      channel2.enqueue({ ...item });
    });
  });

  it('should grab items from each Channel one at a time', (done) => {
    const items = [];
    let string = '';
    let i = 0;
    async function middleware(r, next) {
      string += r.content;
      i += 1;
      if (i < 4) {
        await next();
        return;
      }
      expect(string).to.equal('1324');
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    for (let j = 0; j < 4; j += 1) {
      items.push({
        ...newItem(),
        content: (j + 1).toString(),
      });
    }
    engine.use(middleware);
    engine.start().then(() => {
      channel1.enqueue(items.shift());
      channel1.enqueue(items.shift());
      channel2.enqueue(items.shift());
      channel2.enqueue(items.shift());
    });
  });

  it('should run middleware in the order used', (done) => {
    const item = newItem();
    let string = '';
    async function middleware1(r, next) {
      string += '1';
      await next();
    }
    async function middleware2(r, next) {
      string += '2';
      expect(string).to.equal('12');
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    engine.use(middleware1);
    engine.use(middleware2);
    engine.start().then(() => {
      channel1.enqueue({ ...item });
    });
  });
});
