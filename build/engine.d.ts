/// <reference types="node" />
import EventEmitter from 'events';
import Service from './services/service';
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
    protected services: {
        [key: string]: Service;
    };
    protected middlewareList: MiddlewareFunction[];
    protected middleware?: ComposedMiddlewareFunction;
    protected started: boolean;
    protected counter: number;
    protected empty: boolean;
    protected pointer: number;
    protected serviceErrorListeners: {
        [key: string]: any;
    };
    protected serviceEmptyListener?: any;
    protected serviceNotEmptyListener?: any;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    register(service: Service): string;
    unregister(identifier: any): void;
    service(id: string): Service;
    use(middleware: MiddlewareFunction): Engine;
    protected onServiceError(serviceId: string, err: any): void;
    protected onServiceEmpty(): void;
    protected onServiceNotEmpty(): void;
    protected nextReport(): Promise<void>;
}
export default Engine;
