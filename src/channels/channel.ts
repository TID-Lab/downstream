import EventEmitter from 'events';
import type Item from '../item';
import CircularQueue from '../util/circularQueue';

export interface ChannelOptions {
  capacity?: number;
}

/**
 * A Channel represents a stream of Items from some external data source, like a web API.
 */
class Channel extends EventEmitter {
  started: boolean;

  private queue: CircularQueue<Item>;

  /**
   * Initializes a new Channel.
   */
  constructor(options: ChannelOptions = {}) {
    super();

    this.started = false;
    this.queue = new CircularQueue<Item>(options.capacity);
  }

  /**
   * Starts this Channel so that it will stream Items from some external source.
   */
  async start(): Promise<void> {
    this.started = true;
  }

  /**
   * Stops this Channel so that it will stop streaming Items from some external source.
   */
  async stop(): Promise<void> {
    this.started = false;
  }

  /**
   * Enqueues an Item from some external source onto the internal queue.
   */
  enqueue(item:Item): void {
    const wasEmpty:boolean = this.queue.isEmpty();
    this.queue.add(item);
    if (wasEmpty) {
      this.emit('notEmpty');
    }
  }

  /**
   * Dequeues an Item from the internal queue, if available.
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
   * Returns whether the internal queue is empty.
   */
  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

export default Channel;
