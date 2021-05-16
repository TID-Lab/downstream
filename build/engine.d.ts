/// <reference types="node" />
import EventEmitter from 'events';
import Channel from './channels/channel';
import type Report from './report';
export declare type NextFunction = {
    (): Promise<any>;
};
export declare type MiddlewareFunction = {
    (report: Report, next: NextFunction): Promise<any>;
};
export declare type ComposedMiddlewareFunction = {
    (report: Report): Promise<any>;
};
declare class Engine extends EventEmitter {
    protected channels: {
        [key: string]: Channel;
    };
    protected middlewareList: MiddlewareFunction[];
    protected middleware?: ComposedMiddlewareFunction;
    protected started: boolean;
    protected counter: number;
    protected empty: boolean;
    protected pointer: number;
    protected channelErrorListeners: {
        [key: string]: any;
    };
    protected channelEmptyListener?: any;
    protected channelNotEmptyListener?: any;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    register(channel: Channel): string;
    unregister(identifier: any): void;
    channel(id: string): Channel;
    use(middleware: MiddlewareFunction): Engine;
    protected onChannelError(channelId: string, err: any): void;
    protected onChannelEmpty(): void;
    protected onChannelNotEmpty(): void;
    protected nextReport(): Promise<void>;
}
export default Engine;
