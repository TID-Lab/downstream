import { expect } from 'chai';
import axios from 'axios';
import WebChannel from '../src/channels/web';

class TestWebChannel extends WebChannel {
  path;
}

describe('WebChannel', () => {
  let webChannel: TestWebChannel;
  let otherWebChannel: TestWebChannel;

  before(() => {
    WebChannel.PORT = 4000;

    webChannel = new TestWebChannel({ path: 'test' });
  });

  it('should extend WebChannel', (done) => {
    expect(webChannel instanceof WebChannel).to.be.true;
    done();
  });

  it('should instantiate a new WebChannel', (done) => {
    expect(webChannel.path).to.equal('test');
    done();
  });

  it('should start the web server on port WebChannel.PORT', async function () {
    await webChannel.start();

    let error;
    try {
      await axios({
        method: 'GET',
        baseURL: 'http://localhost:4000',
        url: '/',
      });
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    expect(error.response.status).to.equal(404);
  });

  it('should return 404 on non-POST requests', async () => {
    let error;
    try {
      await axios({
        method: 'GET',
        baseURL: 'http://localhost:4000',
        url: '/test',
        data: JSON.stringify({}),
      });
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    expect(error.response.status).to.equal(404);
  });

  it('should return 400 with non-JSON bodies', async () => {
    let error;
    try {
      await axios({
        method: 'POST',
        baseURL: 'http://localhost:4000',
        url: '/test',
        data: 'Hello, World!',
      });
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    expect(error.response.status).to.equal(400);
  });

  it('should return 404 on incorrect paths', async () => {
    let error;
    try {
      await axios({
        method: 'POST',
        baseURL: 'http://localhost:4000',
        url: '/foo',
      });
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    expect(error.response.status).to.equal(404);
  });

  it('should return 200 when an item is enqeueued', (done) => {
    webChannel.once('notEmpty', () => {
      const item = webChannel.dequeue();
      expect(item.foo).to.equal('bar');
      done();
    });

    axios({
      method: 'POST',
      baseURL: 'http://localhost:4000',
      url: '/test',
      data: JSON.stringify({ foo: 'bar' }),
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

  it('should throw an error when a path already exists', (done) => {
    const badWebChannel = new WebChannel({ path: 'test' });

    badWebChannel.start().catch((err) => {
      expect(err instanceof Error).to.be.true;
      done();
    });
  });

  it('should mount multiple WebChannels', async () => {
    otherWebChannel = new TestWebChannel({ path: 'foo' });
    await otherWebChannel.start();
    const response = await axios({
      method: 'POST',
      baseURL: 'http://localhost:4000',
      url: '/foo',
      data: JSON.stringify({ foo: 'bar' }),
    });
    expect(response.status).to.equal(200);
  });

  it('should stop the web server when all WebChannels stop', async function () {
    this.timeout(1000);

    await webChannel.stop();
    await otherWebChannel.stop();

    let error;
    try {
      await axios({
        method: 'GET',
        baseURL: 'http://localhost:4000',
        url: '/',
      });
    } catch (err) {
      error = err;
    }
    expect(error instanceof Error).to.be.true;
    expect(error.code).to.equal('ECONNREFUSED');
  });
});
