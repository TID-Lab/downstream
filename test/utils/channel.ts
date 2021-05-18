import Channel from '../../src/channels/channel';

class TestChannel extends Channel {
  public throwError:boolean;

  constructor() {
    super();
    this.throwError = false;
  }

  async start() {
    if (this.throwError) {
      throw new Error('Foo bar');
    }
    await super.start();
  }

  async stop() {
    if (this.throwError) {
      throw new Error('Foo bar');
    }
    await super.stop();
  }
}

export default TestChannel;
