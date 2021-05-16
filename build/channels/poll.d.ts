/// <reference types="node" />
import Channel from './channel';
declare abstract class PollChannel extends Channel {
    abstract fetch(): Promise<void>;
    protected interval: number;
    protected timeout?: ReturnType<typeof setTimeout>;
    private static DEFAULT_INTERVAL;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    poll(): Promise<void>;
}
export default PollChannel;
