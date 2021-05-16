import compose from 'koa-compose';
import EventEmitter from 'events';
import Channel from './channels/channel';
import type Report from './report';

/**
 * TODO documentation
 */
export type NextFunction = {
  (): Promise<any>
};

/**
 * TODO documentation
 */
export type MiddlewareFunction = {
  (report: Report, next: NextFunction): Promise<any>
};

/**
 * TODO documentation
 */
export type ComposedMiddlewareFunction = {
  (report: Report): Promise<any>
};

/**
 * TODO documentation
 */
class Engine extends EventEmitter {
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
   * Start the Engine.
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

    // compose Report middleware
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
   * Stop the Engine.
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
   * Register a Channel with the Engine.
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
   * Unregister a Channel from the Engine.
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

    // delete the Channel from the Engine
    delete this.channels[id];
  }

  /**
   * Find a Channel by its ID.
   */
  channel(id:string): Channel {
    return this.channels[id];
  }

  /**
   * Use a Report middleware function.
   */
  use(middleware:MiddlewareFunction): Engine {
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

    // if the `empty` flag switched to false on the next tick, start processing Reports
    process.nextTick(() => {
      if (wasEmpty && !this.empty) {
        this.nextReport();
      }
    });
  }

  /**
   * Process the next Report.
   */
  protected async nextReport(): Promise<void> {
    const nonEmptyChannels:Channel[] = Object.values(this.channels).filter(
      (channel) => !channel.isEmpty(),
    );

    // if no Channels have Reports, return
    if (nonEmptyChannels.length === 0) return;

    // if the pointer is out of bounds, reset it
    if (this.pointer >= nonEmptyChannels.length) this.pointer = 0;

    // dequeue the next available Report
    let id:string|undefined;
    const channel:Channel = nonEmptyChannels[this.pointer];
    const report:Report|null = channel.dequeue();

    if (report) {
      // tag the outgoing Report with a Channel ID
      id = Object.keys(this.channels).find((key) => this.channels[key] === channel);
      if (id) report.from = id.toString();

      // try to call Report middleware on the new Report
      try {
        if (this.middleware) await this.middleware(report);
      } catch (err) {
        this.emit('error', err);
      }
    }

    // increment the pointer
    this.pointer += 1;

    // schedule the next Report to be processed on next tick
    process.nextTick(this.nextReport.bind(this));
  }
}
export default Engine;
