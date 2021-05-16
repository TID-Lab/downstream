import Report from '../report';
import PollChannel from './poll';
declare abstract class PaginationChannel extends PollChannel {
    abstract fetchPage(): Promise<Report[]>;
    protected lastReportDate?: Date;
    constructor(lastReportDate?: Date);
    fetch(): Promise<void>;
}
export default PaginationChannel;
