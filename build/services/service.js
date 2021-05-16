"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const queue_1 = __importDefault(require("../queue"));
class Service extends events_1.default {
    constructor() {
        super();
        this.started = false;
        this.queue = new queue_1.default();
    }
    async start() {
        this.started = true;
    }
    async stop() {
        this.started = false;
    }
    enqueue(report) {
        const wasEmpty = this.queue.isEmpty();
        this.queue.add(report);
        if (wasEmpty) {
            this.emit('notEmpty');
        }
    }
    dequeue() {
        if (!this.queue.isEmpty()) {
            const report = this.queue.fetch();
            if (this.queue.isEmpty()) {
                this.emit('empty');
            }
            return report;
        }
        return null;
    }
    isEmpty() {
        return this.queue.isEmpty();
    }
}
exports.default = Service;
