/// <reference types="node" />
import Service from './service';
declare abstract class PollService extends Service {
    abstract fetch(): Promise<void>;
    protected interval: number;
    protected timeout?: ReturnType<typeof setTimeout>;
    private static DEFAULT_INTERVAL;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    poll(): Promise<void>;
}
export default PollService;
