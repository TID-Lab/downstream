"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = __importDefault(require("./channel"));
class PollChannel extends channel_1.default {
    constructor() {
        super();
        this.interval = PollChannel.DEFAULT_INTERVAL;
    }
    async start() {
        if (this.started)
            return;
        await super.start();
        this.poll();
    }
    async stop() {
        if (this.timeout)
            clearTimeout(this.timeout);
        delete this.timeout;
        await super.stop();
    }
    async poll() {
        if (!this.started)
            return;
        try {
            await this.fetch();
        }
        catch (err) {
            this.emit('error', err);
        }
        this.timeout = setTimeout(this.poll.bind(this), this.interval);
    }
}
PollChannel.DEFAULT_INTERVAL = 10000;
exports.default = PollChannel;
