import EventEmitter from 'events';
import CircularQueue from '../queue';
import Report from '../report';

/**
 * TODO documentation
 */
class Channel extends EventEmitter {
  started: boolean;

  private queue: CircularQueue<Report>;

  constructor() {
    super();

    this.started = false;
    this.queue = new CircularQueue<Report>();
  }

  /**
   * Start the Channel.
   */
  async start(): Promise<void> {
    this.started = true;
  }

  /**
   * Stop the Channel.
   */
  async stop(): Promise<void> {
    this.started = false;
  }

  /**
   * Enqueue the given Report.
   */
  enqueue(report:Report): void {
    const wasEmpty:boolean = this.queue.isEmpty();
    this.queue.add(report);
    if (wasEmpty) {
      this.emit('notEmpty');
    }
  }

  /**
   * Dequeue the next Report, if available
   */
  dequeue():Report|null {
    if (!this.queue.isEmpty()) {
      const report:Report = this.queue.fetch();
      if (this.queue.isEmpty()) {
        this.emit('empty');
      }
      return report;
    }
    return null;
  }

  /**
   * Return whether the Report queue is empty.
   */
  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

export default Channel;
