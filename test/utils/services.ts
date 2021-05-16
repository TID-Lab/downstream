import Service from '../../src/services/service';

class TestService extends Service {
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

export default TestService;
