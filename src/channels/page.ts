import Report from '../report';
import PollChannel from './poll';

/**
 * TODO documentation
 */
abstract class PageChannel extends PollChannel {
  /**
   * Fetch the next page of Reports.
   */
  abstract fetchPage(): Promise<Report[]>;

  protected lastReportDate?: Date;

  constructor(lastReportDate?: Date) {
    super();

    this.lastReportDate = lastReportDate;
  }

  async fetch(): Promise<void> {
    // fetch a page of Reports
    const reports:Report[] = [...await this.fetchPage()];

    // sort the Reports by authoredAt in ascending order
    reports.sort(
      (a, b) => a.authoredAt.getTime() - b.authoredAt.getTime(),
    );

    for (let i:number = 0; i < reports.length; i += 1) {
      const report:Report = reports[i];

      // update the lastReportDate
      if (!this.lastReportDate || this.lastReportDate <= report.authoredAt) {
        this.lastReportDate = report.authoredAt;
      }

      // enqueue each Report in the page
      this.enqueue(report);
    }
  }
}

export default PageChannel;
