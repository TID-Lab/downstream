import type PollChannel from '../channels/poll';

export interface RateLimitPoolOptions {
  interval: number;
}

/**
 * Pools together PollChannels in the same namespace and using the same
 * external resource (e.g. a web API) so that their polls are called
 * consecutively and without exceeding rate limits.
 */
class RateLimitPool {
  protected interval: number;

  protected pollChannels: PollChannel[];

  protected pointer: number;

  protected timeout?:ReturnType<typeof setTimeout>;

  protected stopTimestamp?: Date;

  constructor(options: RateLimitPoolOptions) {
    this.interval = options.interval;
    this.pointer = 0;
    this.pollChannels = [];
  }

  add(pollChannel: PollChannel): void {
    const index = this.pollChannels.indexOf(pollChannel);

    if (index !== -1) {
      throw new Error('Duplicate PollChannel detected.');
    }

    this.pollChannels.push(pollChannel);

    if (this.pollChannels.length === 1) {
      if (this.stopTimestamp) {
        const now = new Date();
        const diff = now.getTime() - this.stopTimestamp.getTime();
        if (diff < this.interval) {
          setTimeout(this.poll.bind(this), this.interval - diff);
        } else {
          this.poll();
        }
        delete this.stopTimestamp;
      } else {
        this.poll();
      }
    }
  }

  remove(pollChannel: PollChannel): void {
    const index = this.pollChannels.indexOf(pollChannel);

    if (index === -1) {
      throw new Error('No PollChannel found.');
    }

    this.pollChannels.splice(index, 1);

    if (this.pollChannels.length === 0) {
      if (this.timeout) clearTimeout(this.timeout);
      delete this.timeout;
      this.stopTimestamp = new Date();
    }
  }

  protected async poll(): Promise<void> {
    // if no Channels are active, return
    if (this.pollChannels.length === 0) return;

    // if the pointer is out of bounds, reset it
    if (this.pointer >= this.pollChannels.length) this.pointer = 0;

    const pollChannel:PollChannel = this.pollChannels[this.pointer];

    // try to call `fetch`
    try {
      await pollChannel.fetch();
    } catch (err) {
      pollChannel.emit('error', err);
    }

    // increment the pointer
    this.pointer += 1;

    // schedule the next poll
    this.timeout = setTimeout(
      this.poll.bind(this),
      this.interval,
    );
  }

  isEmpty() {
    return this.pollChannels.length === 0;
  }
}

export default RateLimitPool;
