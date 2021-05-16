/**
 * TODO documentation
 */
class CircularQueue<T> {
  capacity: number;

  start: number;

  count: number;

  drops: number;

  total: number;

  private elements: T[];

  private static DEFAULT_CAPACITY: number = 200;

  constructor(capacity?:number) {
    this.capacity = capacity || CircularQueue.DEFAULT_CAPACITY;
    this.start = 0;
    this.count = 0;
    this.drops = 0;
    this.total = 0;
    this.elements = new Array<T>(this.capacity);
  }

  add(element:T): number {
    const end:number = (this.start + this.count) % this.capacity;
    this.total += 1;
    const dropped:T = this.peek(end);
    if (dropped) this.drops += 1;
    this.elements[end] = element;
    if (this.isFull()) {
      this.start = (this.start + 1) % this.capacity;
    } else {
      this.count += 1;
    }
    return this.count;
  }

  peek(i?:number): T {
    let j:number|undefined = i;
    if (j === undefined) j = this.start;
    const element:T = this.elements[j];
    return element;
  }

  fetch(): T {
    const element:T = this.peek();
    if (element) {
      this.count -= 1;
      delete this.elements[this.start];
      this.start = (this.start + 1) % this.capacity;
    }
    return element;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }

  clear(): void {
    this.start = 0;
    this.count = 0;
    this.elements = new Array<T>(this.capacity);
  }
}

export default CircularQueue;
