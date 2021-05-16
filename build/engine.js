"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_compose_1 = __importDefault(require("koa-compose"));
const events_1 = __importDefault(require("events"));
const service_1 = __importDefault(require("./services/service"));
class Engine extends events_1.default {
    constructor() {
        super();
        this.services = {};
        this.serviceErrorListeners = {};
        this.serviceEmptyListener = this.onServiceEmpty.bind(this);
        this.serviceNotEmptyListener = this.onServiceNotEmpty.bind(this);
        this.middlewareList = [];
        this.started = false;
        this.counter = 0;
        this.empty = true;
        this.pointer = 0;
    }
    async start() {
        const promises = [];
        this.started = true;
        this.pointer = 0;
        this.empty = Object.values(this.services)
            .reduce((empty, s) => (empty && s.isEmpty()), true);
        this.middleware = koa_compose_1.default(this.middlewareList);
        const ids = Object.keys(this.services);
        for (let i = 0; i < ids.length; i += 1) {
            const id = ids[i];
            const service = this.services[id];
            promises.push(service.start()
                .catch((err) => {
                this.emit('error', err, id);
            }));
        }
        await Promise.allSettled(promises);
    }
    async stop() {
        const promises = [];
        const ids = Object.keys(this.services);
        for (let i = 0; i < ids.length; i += 1) {
            const id = ids[i];
            const service = this.services[id];
            promises.push(service.stop()
                .catch((err) => {
                this.emit('error', err, id);
            }));
        }
        await Promise.allSettled(promises);
        this.started = false;
    }
    register(service) {
        const services = Object.values(this.services);
        for (let i = 0; i < services.length; i += 1) {
            if (services[i] === service) {
                throw new Error('A Service cannot be registered twice.');
            }
        }
        const id = this.counter.toString();
        this.counter += 1;
        this.serviceErrorListeners[id] = this.onServiceError.bind(this, id);
        service.on('error', this.serviceErrorListeners[id]);
        service.on('empty', this.serviceEmptyListener);
        service.on('notEmpty', this.serviceNotEmptyListener);
        this.services[id] = service;
        return id;
    }
    unregister(identifier) {
        let id;
        if (identifier instanceof service_1.default) {
            id = Object.keys(this.services).find((key) => this.services[key] === identifier);
        }
        else {
            id = identifier;
        }
        const service = this.services[id];
        if (!service) {
            throw new Error('No Service found using the given identifier');
        }
        service.removeListener('error', this.serviceErrorListeners[id]);
        service.removeListener('empty', this.serviceEmptyListener);
        service.removeListener('notEmpty', this.serviceNotEmptyListener);
        delete this.serviceErrorListeners[id];
        delete this.services[id];
    }
    service(id) {
        return this.services[id];
    }
    use(middleware) {
        this.middlewareList.push(middleware);
        return this;
    }
    onServiceError(serviceId, err) {
        this.emit('error', err, serviceId);
    }
    onServiceEmpty() {
        const nonEmptyServices = Object.values(this.services).filter((service) => !service.isEmpty());
        if (nonEmptyServices.length === 0) {
            this.empty = true;
        }
    }
    onServiceNotEmpty() {
        const wasEmpty = this.empty;
        this.empty = false;
        process.nextTick(() => {
            if (wasEmpty && !this.empty) {
                this.nextReport();
            }
        });
    }
    async nextReport() {
        const nonEmptyServices = Object.values(this.services).filter((service) => !service.isEmpty());
        if (nonEmptyServices.length === 0)
            return;
        if (this.pointer >= nonEmptyServices.length)
            this.pointer = 0;
        let id;
        const service = nonEmptyServices[this.pointer];
        const report = service.dequeue();
        if (report) {
            id = Object.keys(this.services).find((key) => this.services[key] === service);
            if (id)
                report.from = id.toString();
            try {
                if (this.middleware)
                    await this.middleware(report);
            }
            catch (err) {
                this.emit('error', err);
            }
        }
        this.pointer += 1;
        process.nextTick(this.nextReport.bind(this));
    }
}
exports.default = Engine;
