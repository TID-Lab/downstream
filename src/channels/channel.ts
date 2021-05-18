import EventEmitter from 'events';
import type Item from '../item';
import CircularQueue from '../queue';

/**
 * TODO documentation
 */
class Channel extends EventEmitter {
  started: boolean;

  private queue: CircularQueue<Item>;

  constructor() {
    super();

    this.started = false;
    this.queue = new CircularQueue<Item>();
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
   * Enqueue the given item.
   */
  enqueue(item:Item): void {
    const wasEmpty:boolean = this.queue.isEmpty();
    this.queue.add(item);
    if (wasEmpty) {
      this.emit('notEmpty');
    }
  }

  /**
   * Dequeue the next item, if available
   */
  dequeue():Item|null {
    if (!this.queue.isEmpty()) {
      const item:Item = this.queue.fetch();
      if (this.queue.isEmpty()) {
        this.emit('empty');
      }
      return item;
    }
    return null;
  }

  /**
   * Return whether the item queue is empty.
   */
  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

export default Channel;
