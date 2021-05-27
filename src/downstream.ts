import compose from 'koa-compose';
import EventEmitter from 'events';
import Channel from './channels/channel';
import type Item from './item';

/**
 * Calls the remaining middleware functions that come after this one.
 */
export type NextFunction = {
  (): Promise<any>
};

/**
 * An asynchronous "middleware" function that gets called on each Item
 * of a Downstream instance as they are streamed from the registered Channels.
 */
export type MiddlewareFunction = {
  (item: Item, next: NextFunction): Promise<any>
};

/**
 * A composed middlware function generated with `koa-compose`.
 */
export type ComposedMiddlewareFunction = {
  (item: Item): Promise<any>
};

/**
 * A Downstream instance.
 */
class Downstream extends EventEmitter {
  protected channels: { [key: string]: Channel };

  protected middlewareList: MiddlewareFunction[];

  protected middleware?: ComposedMiddlewareFunction;

  protected started: boolean;

  protected counter: number;

  protected empty: boolean;

  protected pointer: number;

  protected channelErrorListeners: { [key: string]: any };

  protected channelEmptyListener?: any;

  protected channelNotEmptyListener?: any;

  /**
   * Initializes a new instance of Downstream.
   */
  constructor() {
    super();

    this.channels = {};
    this.channelErrorListeners = {};
    this.channelEmptyListener = this.onChannelEmpty.bind(this);
    this.channelNotEmptyListener = this.onChannelNotEmpty.bind(this);
    this.middlewareList = [];
    this.started = false;
    this.counter = 0;
    this.empty = true;
    this.pointer = 0;
  }

  /**
   * Calls `channel.start()` on each of the registered Channels
   * and waits for them to all start. Any errors thrown by a Channel
   * are collected and emitted via the `error` event.
   */
  async start(): Promise<void> {
    const promises:Promise<any>[] = [];

    // set the `started` flag to true
    this.started = true;

    // reset the `pointer` field
    this.pointer = 0;

    // reset the `empty` field
    this.empty = Object.values(this.channels)
      .reduce<boolean>((empty, s) => (empty && s.isEmpty()), true);

    // compose item middleware
    this.middleware = compose(this.middlewareList);

    // wait until all Channels have tried to start
    const ids:string[] = Object.keys(this.channels);
    for (let i:number = 0; i < ids.length; i += 1) {
      const id:string = ids[i];
      const channel:Channel = this.channels[id];

      promises.push(
        channel.start()
          .catch(
            (err) => {
              // emit Channel startup errors
              this.emit('error', err, id);
            },
          ),
      );
    }
    await Promise.allSettled(promises);
  }

  /**
   * Calls `channel.stop()` on each of the registered Channels
   * and waits for them to all stop. Any errors thrown by a Channel
   * are collected and emitted via the `error` event.
   */
  async stop(): Promise<void> {
    const promises:Promise<any>[] = [];

    // wait until all Channels have tried to stop
    const ids:string[] = Object.keys(this.channels);
    for (let i:number = 0; i < ids.length; i += 1) {
      const id:string = ids[i];
      const channel:Channel = this.channels[id];
      promises.push(
        channel.stop()
          .catch(
            (err) => {
              // emit Channel startup errors
              this.emit('error', err, id);
            },
          ),
      );
    }
    await Promise.allSettled(promises);

    // set the `started` flag to false
    this.started = false;
  }

  /**
   * Registers a Channel so that Items will be streamed from the Channel
   * to this Downstream instance once when the channel has been started with `channel.start()`.
   */
  register(channel:Channel): string {
    // throw an error if a duplicate is found
    const channels:Channel[] = Object.values(this.channels);
    for (let i = 0; i < channels.length; i += 1) {
      if (channels[i] === channel) {
        throw new Error('A Channel cannot be registered twice.');
      }
    }

    // generate a unique ID for the Channel
    const id:string = this.counter.toString();
    this.counter += 1;

    // register Channel event listeners
    this.channelErrorListeners[id] = this.onChannelError.bind(this, id);
    channel.on('error', this.channelErrorListeners[id]);
    channel.on('empty', this.channelEmptyListener);
    channel.on('notEmpty', this.channelNotEmptyListener);

    // register the Channel with its ID
    this.channels[id] = channel;

    return id;
  }

  /**
   * Unregisters a Channel so that Items will no longer be streamed from the Channel
   * to this Downstream instance.
   */
  unregister(identifier): void {
    let id:any;

    if (identifier instanceof Channel) {
      // find the Channel by instance
      id = Object.keys(this.channels).find((key) => this.channels[key] === identifier);
    } else {
      // find the Channel by its ID
      id = identifier;
    }
    const channel = this.channels[id];

    if (!channel) {
      throw new Error('No Channel found using the given identifier');
    }

    // unregister Channel event listeners
    channel.removeListener('error', this.channelErrorListeners[id]);
    channel.removeListener('empty', this.channelEmptyListener);
    channel.removeListener('notEmpty', this.channelNotEmptyListener);
    delete this.channelErrorListeners[id];

    // delete the Channel
    delete this.channels[id];
  }

  /**
   * Returns the Channel with the given ID returned before by `downstream.register()`.
   */
  channel(id:string): Channel {
    return this.channels[id];
  }

  /**
   * Adds another middleware function to an ordered set that get called
   * on each Item streamed by this Downstream instance in the order of declaration.
   */
  use(middleware:MiddlewareFunction): Downstream {
    this.middlewareList.push(middleware);
    return this;
  }

  /**
   * An event listener for Channel `error` events.
   */
  protected onChannelError(channelId:string, err:any): void {
    this.emit('error', err, channelId);
  }

  /**
   * An event listener for Channel `empty` events.
   */
  protected onChannelEmpty(): void {
    const nonEmptyChannels:Channel[] = Object.values(this.channels).filter(
      (channel) => !channel.isEmpty(),
    );

    // if all Channels are empty, set the `empty` flag to true
    if (nonEmptyChannels.length === 0) {
      this.empty = true;
    }
  }

  /**
   * An event listener for Channel `notEmpty` events.
   */
  protected onChannelNotEmpty(): void {
    const wasEmpty:boolean = this.empty;

    this.empty = false;

    // if the `empty` flag switched to false on the next tick, start processing items
    process.nextTick(() => {
      if (wasEmpty && !this.empty) {
        this.nextItem();
      }
    });
  }

  /**
   * Process the next Item.
   */
  protected async nextItem(): Promise<void> {
    const nonEmptyChannels:Channel[] = Object.values(this.channels).filter(
      (channel) => !channel.isEmpty(),
    );

    // if no Channels have items, return
    if (nonEmptyChannels.length === 0) return;

    // if the pointer is out of bounds, reset it
    if (this.pointer >= nonEmptyChannels.length) this.pointer = 0;

    // dequeue the next available item
    let id:string|undefined;
    const channel:Channel = nonEmptyChannels[this.pointer];
    const item:Item|null = channel.dequeue();

    if (item) {
      // tag the outgoing item with a Channel ID
      id = Object.keys(this.channels).find((key) => this.channels[key] === channel);
      if (id) item.from = id.toString();

      // try to call item middleware on the new item
      try {
        if (this.middleware) await this.middleware(item);
      } catch (err) {
        this.emit('error', err);
      }
    }

    // increment the pointer
    this.pointer += 1;

    // schedule the next item to be processed on next tick
    process.nextTick(this.nextItem.bind(this));
  }
}
export default Downstream;
