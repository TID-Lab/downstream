import { expect } from 'chai';
import Service from '../../src/services/service';
import PollService from '../../src/services/poll';
import assembleTestReport from '../utils/reports';

class TestPollService extends PollService {
  interval: number;

  timeout!: ReturnType<typeof setTimeout>;

  i: number;

  throwError: boolean;

  constructor() {
    super();

    this.i = 0;
    this.interval = 10;
    this.throwError = false;
  }

  async fetch() {
    if (this.throwError) {
      throw new Error('Foo bar');
    }

    const report = assembleTestReport();
    report.raw.i = this.i;
    this.i += 1;
    this.enqueue(report);
  }
}

describe('PollService', () => {
  let pollService:TestPollService;

  before((done) => {
    pollService = new TestPollService();
    done();
  });

  it('should extend Service', (done) => {
    expect(pollService instanceof Service).to.be.true;
    done();
  });

  it('should instantiate a new PollService', (done) => {
    expect(pollService.interval).to.equal(10);
    done();
  });

  it('should only poll when started', (done) => {
    pollService.poll();
    setTimeout(() => {
      expect(pollService.started).to.be.false;
      expect(pollService.timeout).to.be.undefined;
      expect(pollService.i).to.equal(0);
      done();
    }, 20);
  });

  it('should poll several times', (done) => {
    pollService.start().then(() => {
      expect(pollService.timeout).to.not.be.undefined;
      expect(pollService.started).to.be.true;
    });
    setTimeout(() => {
      expect(pollService.i).to.equal(2);
      done();
    }, 15);
  });

  it('should stop polling', (done) => {
    pollService.stop().then(() => {
      expect(pollService.timeout).to.undefined;
      expect(pollService.started).to.be.false;
    });
    expect(pollService.i).to.be.gte(2);
    done();
  });

  it('should catch and emit fetch errors', (done) => {
    pollService.throwError = true;

    function callback(err) {
      expect(err instanceof Error).to.be.true;
      pollService.removeListener('error', callback);
      pollService.stop().then(done);
    }
    pollService.on('error', callback);
    pollService.start();
  });
});
