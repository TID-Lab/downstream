import { expect } from 'chai';
import Channel from '../src/channels/channel';
import PageChannel, { FetchCallback } from '../src/channels/page';
import TestTimestampedItem from './utils/timestamped_item';

const now:Date = new Date();

const date1:Date = new Date();
const date2:Date = new Date();
date2.setHours(date2.getHours() - 1);

const item1 = new TestTimestampedItem(date1);
const item2 = new TestTimestampedItem(date2);

class TestPageChannel extends PageChannel {
  lastTimestamp?: Date;

  onFetch?: FetchCallback;

  timeout!: ReturnType<typeof setTimeout>;

  i: number;

  constructor() {
    super({ namespace: 'test' });

    this.i = 0;
    this.lastTimestamp = now;
  }

  async fetch() {
    await super.fetch();
  }

  protected async fetchPage() {
    return [item1, item2];
  }
}

describe('PageChannel', () => {
  let pageChannel:TestPageChannel;

  before((done) => {
    pageChannel = new TestPageChannel();
    done();
  });

  it('should extend Channel', (done) => {
    expect(pageChannel instanceof Channel).to.be.true;
    done();
  });

  it('should instantiate a new PageChannel', (done) => {
    expect(pageChannel.lastTimestamp).to.equal(now);
    done();
  });

  it('should fetch and an enqueue a page of items', (done) => {
    pageChannel.fetch().then(() => {
      // test for ascending order of page by timestamp
      expect(pageChannel.dequeue()).to.equal(item2);
      expect(pageChannel.dequeue()).to.equal(item1);

      // test for updated lastTimestamp field
      expect(pageChannel.lastTimestamp).to.equal(item1.timestamp);
      done();
    });
  });

  it('should call the onFetch callback after each fetch', (done) => {
    pageChannel.onFetch = async (lastTimestamp) => {
      expect(lastTimestamp).to.equal(item1.timestamp);
      done();
    };
    pageChannel.fetch();
  });
});
