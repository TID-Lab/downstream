/// <reference types="node" />
import EventEmitter from 'events';
import Report from '../report';
declare class Channel extends EventEmitter {
    started: boolean;
    private queue;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    enqueue(report: Report): void;
    dequeue(): Report | null;
    isEmpty(): boolean;
}
export default Channel;
