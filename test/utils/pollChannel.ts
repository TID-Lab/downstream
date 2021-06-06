import PollChannel, { PollOptions } from '../../src/channels/poll';

class TestPollChannel extends PollChannel {
  interval: number;

  timeout!: ReturnType<typeof setTimeout>;

  i: number;

  throwError: boolean;

  constructor(options: PollOptions) {
    super(options);

    this.i = 0;
    this.interval = 10;
    this.throwError = false;
  }

  async fetch() {
    if (this.throwError) {
      throw new Error('Foo bar');
    }
    this.i += 1;
    this.enqueue({});
  }
}

export default TestPollChannel;
