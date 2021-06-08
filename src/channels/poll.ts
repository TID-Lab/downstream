import Channel, { ChannelOptions } from './channel';
import RateLimitPool from '../util/rateLimitPool';

const rateLimitPools: { [key: string]: RateLimitPool } = {};

export interface PollOptions extends ChannelOptions {
  namespace?: string;
  interval?: number;
}

/**
 * A Channel that polls an external data source on a regular interval
 * via the fetch() function.
 */
abstract class PollChannel extends Channel {
  /**
   * Fetches data from an external source and enqueues it as Items.
   */
  abstract fetch(): Promise<void>;

  protected namespace: string;

  protected interval: number;

  private static DEFAULT_INTERVAL: number = 10000;

  constructor(options: PollOptions) {
    super(options);

    if (!options.namespace) {
      throw new Error('All PollChannels must be in a namespace.');
    }

    this.namespace = options.namespace;
    this.interval = options.interval || PollChannel.DEFAULT_INTERVAL;
  }

  /**
   * Begins polling the external data source.
   */
  async start(): Promise<void> {
    // return if the PollChannel already started
    if (this.started) return;

    await super.start();

    if (!rateLimitPools[this.namespace]) {
      rateLimitPools[this.namespace] = new RateLimitPool({
        interval: this.interval,
      });
    }
    const rateLimitPool = rateLimitPools[this.namespace];
    rateLimitPool.add(this);
  }

  /**
   * Stops polling the external data source.
   */
  async stop(): Promise<void> {
    if (!rateLimitPools[this.namespace]) {
      throw new Error('No rate limit pool found.');
    }
    const rateLimitPool = rateLimitPools[this.namespace];
    rateLimitPool.remove(this);
    if (rateLimitPool.isEmpty()) {
      delete rateLimitPools[this.namespace];
    }

    await super.stop();
  }
}

export default PollChannel;
