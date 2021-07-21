import type Item from '../item';
import PollChannel, { PollOptions } from './poll';

/**
 * A timestamped Item.
 */
export interface TimestampedItem extends Item {
  getTimestamp(): Date;
}

/**
 * The function called after each pageChannel.fetchPage() call has completed.
 */
export type FetchCallback = {
  (lastTimestamp?: Date): Promise<void>
};

export interface PageOptions extends PollOptions {
  lastTimestamp?: Date;
  onFetch?: FetchCallback;
}

/**
 * A PollChannel that pages through its external data source.
 */
abstract class PageChannel extends PollChannel {
  /**
   * Fetches the next page of data from an external source and
   * turns it into an array of TimestampedItems.
   */
  protected abstract fetchPage(): Promise<TimestampedItem[]>;

  protected lastTimestamp?: Date;

  protected onFetch?: FetchCallback;

  constructor(options: PageOptions = {}) {
    super(options);

    this.lastTimestamp = options.lastTimestamp;
    this.onFetch = options.onFetch?.bind(this);
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
