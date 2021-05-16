declare class CircularQueue<T> {
    capacity: number;
    start: number;
    count: number;
    drops: number;
    total: number;
    private elements;
    private static DEFAULT_CAPACITY;
    constructor(capacity?: number);
    add(element: T): number;
    peek(i?: number): T;
    fetch(): T;
    isEmpty(): boolean;
    isFull(): boolean;
    clear(): void;
}
export default CircularQueue;
