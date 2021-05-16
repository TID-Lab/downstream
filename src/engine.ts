import compose from 'koa-compose';
import EventEmitter from 'events';
import Service from './services/service';
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
  protected services: { [key: string]: Service };

  protected middlewareList: MiddlewareFunction[];

  protected middleware?: ComposedMiddlewareFunction;

  protected started: boolean;

  protected counter: number;

  protected empty: boolean;

  protected pointer: number;

  protected serviceErrorListeners: { [key: string]: any };

  protected serviceEmptyListener?: any;

  protected serviceNotEmptyListener?: any;

  constructor() {
    super();

    this.services = {};
    this.serviceErrorListeners = {};
    this.serviceEmptyListener = this.onServiceEmpty.bind(this);
    this.serviceNotEmptyListener = this.onServiceNotEmpty.bind(this);
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
    this.empty = Object.values(this.services)
      .reduce<boolean>((empty, s) => (empty && s.isEmpty()), true);

    // compose Report middleware
    this.middleware = compose(this.middlewareList);

    // wait until all Services have tried to start
    const ids:string[] = Object.keys(this.services);
    for (let i:number = 0; i < ids.length; i += 1) {
      const id:string = ids[i];
      const service:Service = this.services[id];

      promises.push(
        service.start()
          .catch(
            (err) => {
              // emit Service startup errors
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

    // wait until all Services have tried to stop
    const ids:string[] = Object.keys(this.services);
    for (let i:number = 0; i < ids.length; i += 1) {
      const id:string = ids[i];
      const service:Service = this.services[id];
      promises.push(
        service.stop()
          .catch(
            (err) => {
              // emit Service startup errors
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
   * Register a Service with the Engine.
   */
  register(service:Service): string {
    // throw an error if a duplicate is found
    const services:Service[] = Object.values(this.services);
    for (let i = 0; i < services.length; i += 1) {
      if (services[i] === service) {
        throw new Error('A Service cannot be registered twice.');
      }
    }

    // generate a unique ID for the Service
    const id:string = this.counter.toString();
    this.counter += 1;

    // register Service event listeners
    this.serviceErrorListeners[id] = this.onServiceError.bind(this, id);
    service.on('error', this.serviceErrorListeners[id]);
    service.on('empty', this.serviceEmptyListener);
    service.on('notEmpty', this.serviceNotEmptyListener);

    // register the Service with its ID
    this.services[id] = service;

    return id;
  }

  /**
   * Unregister a Service from the Engine.
   */
  unregister(identifier): void {
    let id:any;

    if (identifier instanceof Service) {
      // find the Service by instance
      id = Object.keys(this.services).find((key) => this.services[key] === identifier);
    } else {
      // find the Service by its ID
      id = identifier;
    }
    const service = this.services[id];

    if (!service) {
      throw new Error('No Service found using the given identifier');
    }

    // unregister Service event listeners
    service.removeListener('error', this.serviceErrorListeners[id]);
    service.removeListener('empty', this.serviceEmptyListener);
    service.removeListener('notEmpty', this.serviceNotEmptyListener);
    delete this.serviceErrorListeners[id];

    // delete the Service from the Engine
    delete this.services[id];
  }

  /**
   * Find a Service by its ID.
   */
  service(id:string): Service {
    return this.services[id];
  }

  /**
   * Use a Report middleware function.
   */
  use(middleware:MiddlewareFunction): Engine {
    this.middlewareList.push(middleware);
    return this;
  }

  /**
   * An event listener for Service `error` events.
   */
  protected onServiceError(serviceId:string, err:any): void {
    this.emit('error', err, serviceId);
  }

  /**
   * An event listener for Service `empty` events.
   */
  protected onServiceEmpty(): void {
    const nonEmptyServices:Service[] = Object.values(this.services).filter(
      (service) => !service.isEmpty(),
    );

    // if all Services are empty, set the `empty` flag to true
    if (nonEmptyServices.length === 0) {
      this.empty = true;
    }
  }

  /**
   * An event listener for Service `notEmpty` events.
   */
  protected onServiceNotEmpty(): void {
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
    const nonEmptyServices:Service[] = Object.values(this.services).filter(
      (service) => !service.isEmpty(),
    );

    // if no Services have Reports, return
    if (nonEmptyServices.length === 0) return;

    // if the pointer is out of bounds, reset it
    if (this.pointer >= nonEmptyServices.length) this.pointer = 0;

    // dequeue the next available Report
    let id:string|undefined;
    const service:Service = nonEmptyServices[this.pointer];
    const report:Report|null = service.dequeue();

    if (report) {
      // tag the outgoing Report with a Service ID
      id = Object.keys(this.services).find((key) => this.services[key] === service);
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
