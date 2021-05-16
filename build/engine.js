"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_compose_1 = __importDefault(require("koa-compose"));
const events_1 = __importDefault(require("events"));
const channel_1 = __importDefault(require("./channels/channel"));
class Engine extends events_1.default {
    constructor() {
        super();
        this.channels = {};
        this.channelErrorListeners = {};
        this.channelEmptyListener = this.onChannelEmpty.bind(this);
        this.channelNotEmptyListener = this.onChannelNotEmpty.bind(this);
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
        this.empty = Object.values(this.channels)
            .reduce((empty, s) => (empty && s.isEmpty()), true);
        this.middleware = koa_compose_1.default(this.middlewareList);
        const ids = Object.keys(this.channels);
        for (let i = 0; i < ids.length; i += 1) {
            const id = ids[i];
            const channel = this.channels[id];
            promises.push(channel.start()
                .catch((err) => {
                this.emit('error', err, id);
            }));
        }
        await Promise.allSettled(promises);
    }
    async stop() {
        const promises = [];
        const ids = Object.keys(this.channels);
        for (let i = 0; i < ids.length; i += 1) {
            const id = ids[i];
            const channel = this.channels[id];
            promises.push(channel.stop()
                .catch((err) => {
                this.emit('error', err, id);
            }));
        }
        await Promise.allSettled(promises);
        this.started = false;
    }
    register(channel) {
        const channels = Object.values(this.channels);
        for (let i = 0; i < channels.length; i += 1) {
            if (channels[i] === channel) {
                throw new Error('A Channel cannot be registered twice.');
            }
        }
        const id = this.counter.toString();
        this.counter += 1;
        this.channelErrorListeners[id] = this.onChannelError.bind(this, id);
        channel.on('error', this.channelErrorListeners[id]);
        channel.on('empty', this.channelEmptyListener);
        channel.on('notEmpty', this.channelNotEmptyListener);
        this.channels[id] = channel;
        return id;
    }
    unregister(identifier) {
        let id;
        if (identifier instanceof channel_1.default) {
            id = Object.keys(this.channels).find((key) => this.channels[key] === identifier);
        }
        else {
            id = identifier;
        }
        const channel = this.channels[id];
        if (!channel) {
            throw new Error('No Channel found using the given identifier');
        }
        channel.removeListener('error', this.channelErrorListeners[id]);
        channel.removeListener('empty', this.channelEmptyListener);
        channel.removeListener('notEmpty', this.channelNotEmptyListener);
        delete this.channelErrorListeners[id];
        delete this.channels[id];
    }
    channel(id) {
        return this.channels[id];
    }
    use(middleware) {
        this.middlewareList.push(middleware);
        return this;
    }
    onChannelError(channelId, err) {
        this.emit('error', err, channelId);
    }
    onChannelEmpty() {
        const nonEmptyChannels = Object.values(this.channels).filter((channel) => !channel.isEmpty());
        if (nonEmptyChannels.length === 0) {
            this.empty = true;
        }
    }
    onChannelNotEmpty() {
        const wasEmpty = this.empty;
        this.empty = false;
        process.nextTick(() => {
            if (wasEmpty && !this.empty) {
                this.nextReport();
            }
        });
    }
    async nextReport() {
        const nonEmptyChannels = Object.values(this.channels).filter((channel) => !channel.isEmpty());
        if (nonEmptyChannels.length === 0)
            return;
        if (this.pointer >= nonEmptyChannels.length)
            this.pointer = 0;
        let id;
        const channel = nonEmptyChannels[this.pointer];
        const report = channel.dequeue();
        if (report) {
            id = Object.keys(this.channels).find((key) => this.channels[key] === channel);
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
