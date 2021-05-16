import { expect } from 'chai';
import Engine from '../src/engine';
import TestService from './utils/services';
import assembleTestReport from './utils/reports';

class TestEngine extends Engine {
  services;

  middlewareList;

  middleware;

  started;

  counter;

  empty;

  pointer;

  serviceErrorListeners;

  serviceEmptyListener;

  serviceNotEmptyListener;

  disableListeners: boolean;

  callbackCounter: number;

  constructor() {
    super();

    this.disableListeners = false;
    this.callbackCounter = 0;
  }

  onServiceError(id, err) {
    if (!this.disableListeners) {
      super.onServiceError(id, err);
    }
    this.callbackCounter += 1;
  }

  onServiceEmpty() {
    if (!this.disableListeners) {
      super.onServiceEmpty();
    }
    this.callbackCounter += 1;
  }

  onServiceNotEmpty() {
    if (!this.disableListeners) {
      super.onServiceNotEmpty();
    }
    this.callbackCounter += 1;
  }
}

describe('Engine', () => {
  let engine:TestEngine;
  let service1:TestService;
  let service2:TestService;
  let id1:string;
  let id2:string;

  before((done) => {
    engine = new TestEngine();
    service1 = new TestService();
    service2 = new TestService();
    done();
  });

  it('should instantiate a new Engine', (done) => {
    expect(engine.services).to.be.a('object');
    expect(engine.services).to.be.empty;
    expect(engine.serviceErrorListeners).to.be.a('object');
    expect(Array.isArray(engine.middlewareList)).to.be.true;
    expect(engine.middlewareList).to.be.empty;
    expect(engine.started).to.be.false;
    expect(engine.counter).to.equal(0);
    expect(engine.empty).to.be.true;
    expect(engine.pointer).to.equal(0);
    done();
  });

  it('should register a Service', (done) => {
    id1 = engine.register(service1);
    expect(engine.counter).to.equal(1);
    expect(engine.services[id1]).to.equal(service1);
    expect(engine.serviceErrorListeners[id1]).to.be.a('function');
    expect(engine.serviceEmptyListener).to.be.a('function');
    expect(engine.serviceNotEmptyListener).to.be.a('function');

    engine.disableListeners = true;
    service1.emit('error');
    service1.emit('empty');
    service1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(engine.callbackCounter).to.equal(3);
            engine.callbackCounter = 0;
            done();
          },
        ),
      ),
    );
  });

  it('should not register a Service twice', (done) => {
    expect(engine.register.bind(engine, service1)).to.throw();
    expect(engine.counter).to.equal(1);
    done();
  });

  it('should return registered Services', (done) => {
    expect(engine.service(id1)).to.equal(service1);
    done();
  });

  it('should unregister a Service', (done) => {
    engine.unregister(id1);

    expect(engine.services[id1]).to.be.undefined;
    expect(engine.serviceErrorListeners[id1]).to.be.undefined;
    expect(engine.serviceEmptyListener).to.be.a('function');
    expect(engine.serviceNotEmptyListener).to.be.a('function');

    // emitting the `error` throws an Error with no listeners.
    expect(service1.emit.bind(service1, 'error')).to.throw();
    service1.emit('empty');
    service1.emit('notEmpty');

    // process all 3 events
    process.nextTick(
      () => process.nextTick(
        () => process.nextTick(
          () => {
            expect(engine.callbackCounter).to.equal(0);
            engine.callbackCounter = 0;
            engine.disableListeners = false;
            done();
          },
        ),
      ),
    );
  });

  it('should throw an error when unregistering fails', (done) => {
    expect(engine.unregister.bind(engine, id1)).to.throw();
    done();
  });

  it('should start registered Services on start', (done) => {
    id1 = engine.register(service1);
    id2 = engine.register(service2);
    engine.start().then(() => {
      expect(engine.started).to.be.true;
      expect(service1.started).to.be.true;
      expect(service2.started).to.be.true;
      done();
    });
  });

  it('should stop registered Services on stop', (done) => {
    engine.stop().then(() => {
      expect(engine.started).to.be.false;
      expect(service1.started).to.be.false;
      expect(service2.started).to.be.false;
      done();
    });
  });

  it('should reset itself on start', (done) => {
    engine.pointer = 5;
    engine.empty = false;
    engine.start().then(() => {
      expect(engine.started).to.be.true;
      expect(engine.pointer).to.equal(0);
      expect(engine.empty).to.be.true;
      engine.stop().then(done);
    });
  });

  it('should handle Service start errors gracefully', (done) => {
    service2.throwError = true;

    function callback(err, id) {
      expect(err instanceof Error).to.be.true;
      expect(id.toString()).to.equal(id2.toString());
      engine.removeListener('error', callback);
      service2.throwError = false;
      engine.stop().then(done);
    }
    engine.on('error', callback);
    engine.start();
  });

  it('should handle Service stop errors gracefully', (done) => {
    engine.start().then(() => {
      service2.throwError = true;

      function callback(err, id) {
        expect(err instanceof Error).to.be.true;
        expect(id.toString()).to.equal(id2.toString());
        engine.removeListener('error', callback);
        service2.throwError = false;
        done();
      }
      engine.on('error', callback);
      engine.stop();
    });
  });

  it('should use middleware', (done) => {
    const report = assembleTestReport();
    async function middleware(_, next) {
      engine.middlewareList = [];
      await engine.stop();

      done();

      await next();
    }
    engine.use(middleware);
    engine.start().then(() => {
      service1.enqueue(report);
    });
  });

  it('should tag outgoing Reports with a Service ID', (done) => {
    const report = assembleTestReport();
    let firstReport = true;
    async function middleware(r, next) {
      if (firstReport) {
        expect(r.from).to.equal(id1.toString());
        firstReport = false;
        await next();
        return;
      }
      expect(r.from).to.equal(id2.toString());
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    engine.use(middleware);
    engine.start().then(() => {
      service1.enqueue({ ...report });
      service2.enqueue({ ...report });
    });
  });

  it('should grab Reports from each Service one at a time', (done) => {
    const reports = [];
    let string = '';
    let i = 0;
    async function middleware(r, next) {
      string += r.content;
      i += 1;
      if (i < 4) {
        await next();
        return;
      }
      expect(string).to.equal('1324');
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    for (let j = 0; j < 4; j += 1) {
      reports.push({
        ...assembleTestReport(),
        content: (j + 1).toString(),
      });
    }
    engine.use(middleware);
    engine.start().then(() => {
      service1.enqueue(reports.shift());
      service1.enqueue(reports.shift());
      service2.enqueue(reports.shift());
      service2.enqueue(reports.shift());
    });
  });

  it('should run middleware in the order used', (done) => {
    const report = assembleTestReport();
    let string = '';
    async function middleware1(r, next) {
      string += '1';
      await next();
    }
    async function middleware2(r, next) {
      string += '2';
      expect(string).to.equal('12');
      engine.middlewareList = [];
      await engine.stop();
      await next();
      done();
    }
    engine.use(middleware1);
    engine.use(middleware2);
    engine.start().then(() => {
      service1.enqueue({ ...report });
    });
  });
});
