import { expect } from 'chai';
import CircularQueue from '../../src/queue';
import Service from '../../src/services/service';

describe('Service', () => {
  let service;

  before((done) => {
    service = new Service();
    done();
  });

  it('should instantiate a new Service', (done) => {
    expect(service.started).to.be.false;
    expect(service.queue instanceof CircularQueue).to.be.true;
    done();
  });

  it('should start', (done) => {
    service.start().then(() => {
      expect(service.started).to.be.true;
      done();
    });
  });

  it('should stop', (done) => {
    service.stop().then(() => {
      expect(service.started).to.be.false;
      done();
    });
  });

  it('should enqueue a Report', (done) => {
    function callback() {
      expect(service.isEmpty()).to.be.false;

      service.removeListener('notEmpty', callback);
      done();
    }
    service.on('notEmpty', callback);
    service.enqueue({ foo: 'bar' });
  });

  it('should dequeue a Report', (done) => {
    function callback() {
      expect(service.isEmpty()).to.be.true;

      service.removeListener('empty', callback);
      done();
    }
    service.on('empty', callback);

    const report = service.dequeue();
    expect(report.foo).to.equal('bar');
    expect(service.dequeue()).to.be.null;
  });
});
