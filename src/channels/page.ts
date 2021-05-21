import type Item from '../item';
import PollChannel from './poll';

/**
 * TODO documentation
 */
export interface TimestampedItem extends Item {
  getTimestamp(): Date;
}

export type FetchCallback = {
  (lastTimestamp?: Date): Promise<any>
};

interface Options {
  delay?: number;
  lastTimestamp?: Date;
  onFetch?: FetchCallback,
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

  protected onFetch?: FetchCallback;

  constructor(options: Options = {}) {
    super(options.delay);

    this.lastTimestamp = options.lastTimestamp;
    this.onFetch = options.onFetch;
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

    if (typeof this.onFetch === 'function') {
      await this.onFetch(this.lastTimestamp);
    }
  }
}

export default PageChannel;
