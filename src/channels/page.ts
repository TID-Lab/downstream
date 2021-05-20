import type Item from '../item';
import PollChannel from './poll';

/**
 * TODO documentation
 */
export interface TimestampedItem extends Item {
  getTimestamp(): Date;
}

interface Options {
  lastTimestamp?: Date;
  delay?: number;
}

/**
 * TODO documentation
 */
abstract class PageChannel extends PollChannel {
  /**
   * Fetch the next page.
   */
  abstract fetchPage(): Promise<TimestampedItem[]>;

  protected lastTimestamp?: Date;

  constructor(options: Options = {}) {
    super(options.delay);

    this.lastTimestamp = options.lastTimestamp;
  }

  async fetch(): Promise<void> {
    // fetch the next page
    const page:TimestampedItem[] = [...await this.fetchPage()];

    // sort the objects by their timestamp in ascending order
    page.sort(
      (a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime(),
    );

    for (let i:number = 0; i < page.length; i += 1) {
      const item:TimestampedItem = page[i];

      // update the timestamp
      if (!this.lastTimestamp || this.lastTimestamp <= item.getTimestamp()) {
        this.lastTimestamp = item.getTimestamp();
      }

      // enqueue each item in the page
      this.enqueue(item);
    }
  }
}

export default PageChannel;
