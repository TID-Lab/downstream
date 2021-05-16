"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CircularQueue {
    constructor(capacity) {
        this.capacity = capacity || CircularQueue.DEFAULT_CAPACITY;
        this.start = 0;
        this.count = 0;
        this.drops = 0;
        this.total = 0;
        this.elements = new Array(this.capacity);
    }
    add(element) {
        const end = (this.start + this.count) % this.capacity;
        this.total += 1;
        const dropped = this.peek(end);
        if (dropped)
            this.drops += 1;
        this.elements[end] = element;
        if (this.isFull()) {
            this.start = (this.start + 1) % this.capacity;
        }
        else {
            this.count += 1;
        }
        return this.count;
    }
    peek(i) {
        let j = i;
        if (j === undefined)
            j = this.start;
        const element = this.elements[j];
        return element;
    }
    fetch() {
        const element = this.peek();
        if (element) {
            this.count -= 1;
            delete this.elements[this.start];
            this.start = (this.start + 1) % this.capacity;
        }
        return element;
    }
    isEmpty() {
        return this.count === 0;
    }
    isFull() {
        return this.count === this.capacity;
    }
    clear() {
        this.start = 0;
        this.count = 0;
        this.elements = new Array(this.capacity);
    }
}
CircularQueue.DEFAULT_CAPACITY = 200;
exports.default = CircularQueue;
