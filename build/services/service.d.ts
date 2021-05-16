/// <reference types="node" />
import EventEmitter from 'events';
import Report from '../report';
declare class Service extends EventEmitter {
    started: boolean;
    private queue;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    enqueue(report: Report): void;
    dequeue(): Report | null;
    isEmpty(): boolean;
}
export default Service;
