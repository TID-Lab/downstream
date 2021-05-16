import Service from './service';

/**
 * TODO documentation
 */
abstract class PollService extends Service {
  /**
   * Fetch Reports.
   */
  abstract fetch(): Promise<void>;

  protected interval: number;

  protected timeout?:ReturnType<typeof setTimeout>;

  private static DEFAULT_INTERVAL: number = 10000;

  constructor() {
    super();

    this.interval = PollService.DEFAULT_INTERVAL;
  }

  /**
   * Start the PollService.
   */
  async start(): Promise<void> {
    // return if the PollService already started
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
    // return if the PollService is not started
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

export default PollService;
