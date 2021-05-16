import Channel from './channel';

/**
 * TODO documentation
 */
abstract class PollChannel extends Channel {
  /**
   * Fetch Reports.
   */
  abstract fetch(): Promise<void>;

  protected interval: number;

  protected timeout?:ReturnType<typeof setTimeout>;

  private static DEFAULT_INTERVAL: number = 10000;

  constructor() {
    super();

    this.interval = PollChannel.DEFAULT_INTERVAL;
  }

  /**
   * Start the PollChannel.
   */
  async start(): Promise<void> {
    // return if the PollChannel already started
    if (this.started) return;

    await super.start();

    // run the first poll
    this.poll();
  }

  async stop(): Promise<void> {
    if (this.timeout) clearTimeout(this.timeout);
    delete this.timeout;
    await super.stop();
  }

  /**
   * Poll
   */
  async poll(): Promise<void> {
    // return if the PollChannel is not started
    if (!this.started) return;

    // try to call `fetch`
    try {
      await this.fetch();
    } catch (err) {
      this.emit('error', err);
    }

    // schedule the next poll
    this.timeout = setTimeout(
      this.poll.bind(this),
      this.interval,
    );
  }
}

export default PollChannel;
