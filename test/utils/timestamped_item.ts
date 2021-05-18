import { TimestampedItem } from '../../src/channels/page';

export default class TestTimestampedItem implements TimestampedItem {
  timestamp: Date;

  constructor(timestamp: Date) {
    this.timestamp = timestamp;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}
