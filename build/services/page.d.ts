import Report from '../report';
import PollService from './poll';
declare abstract class PaginationService extends PollService {
    abstract fetchPage(): Promise<Report[]>;
    protected lastReportDate?: Date;
    constructor(lastReportDate?: Date);
    fetch(): Promise<void>;
}
export default PaginationService;
