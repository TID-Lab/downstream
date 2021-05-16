import { expect } from 'chai';
import Service from '../../src/services/service';
import PageService from '../../src/services/page';
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

class TestPageService extends PageService {
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

describe('PageService', () => {
  let pageService:TestPageService;

  before((done) => {
    pageService = new TestPageService();
    done();
  });

  it('should extend Service', (done) => {
    expect(pageService instanceof Service).to.be.true;
    done();
  });

  it('should instantiate a new PageService', (done) => {
    expect(pageService.lastReportDate).to.equal(now);
    done();
  });

  it('should fetch and an enqueue a page of Reports', (done) => {
    pageService.fetch().then(() => {
      // test for ascending order of page by authoredDate
      expect(pageService.dequeue()).to.equal(report2);
      expect(pageService.dequeue()).to.equal(report1);

      // test for updated lastReportDate field
      expect(pageService.lastReportDate).to.equal(report1.authoredAt);
      done();
    });
  });
});
