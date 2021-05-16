import { expect } from 'chai';
import Channel from '../../src/channels/channel';
import PageChannel from '../../src/channels/page';
import assembleTestReport from '../utils/reports';
import Report from '../../src/report';

const now:Date = new Date();

const report1:Report = assembleTestReport();
const report2:Report = assembleTestReport();
const date1:Date = new Date();
const date2:Date = new Date();
date2.setHours(date2.getHours() - 1);

report1.authoredAt = date1;
report2.authoredAt = date2;

class TestPageChannel extends PageChannel {
  lastReportDate?: Date;

  timeout!: ReturnType<typeof setTimeout>;

  i: number;

  constructor() {
    super();

    this.i = 0;
    this.lastReportDate = now;
  }

  async fetchPage() {
    return [report1, report2];
  }
}

describe('PageChannel', () => {
  let pageChannel:TestPageChannel;

  before((done) => {
    pageChannel = new TestPageChannel();
    done();
  });

  it('should extend Channel', (done) => {
    expect(pageChannel instanceof Channel).to.be.true;
    done();
  });

  it('should instantiate a new PageChannel', (done) => {
    expect(pageChannel.lastReportDate).to.equal(now);
    done();
  });

  it('should fetch and an enqueue a page of Reports', (done) => {
    pageChannel.fetch().then(() => {
      // test for ascending order of page by authoredDate
      expect(pageChannel.dequeue()).to.equal(report2);
      expect(pageChannel.dequeue()).to.equal(report1);

      // test for updated lastReportDate field
      expect(pageChannel.lastReportDate).to.equal(report1.authoredAt);
      done();
    });
  });
});
