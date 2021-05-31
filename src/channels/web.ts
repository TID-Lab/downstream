import http from 'http';
import type { Socket } from 'net';
import { URL } from 'url';
import Channel from './channel';

let webServerStarted = false;

let onWebServerError;

const webServerSockets:Set<Socket> = new Set<Socket>();

const webChannels: { [key: string]: WebChannel } = {};

function onWebServerConnection(socket: Socket) {
  webServerSockets.add(socket);
  socket.on('close', () => {
    webServerSockets.delete(socket);
  });
}

function onRequest(req, res) {
  if (!req.url) {
    res.statusCode = 500;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 404;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const webChannel = webChannels[url.pathname.slice(1)];
  if (!webChannel) {
    res.statusCode = 404;
    res.end();
    return;
  }

  req.on('error', (err) => {
    webChannel.emit('error', err);
  });

  const chunks:any[] = [];

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const item = JSON.parse(Buffer.concat(chunks).toString());
      webChannel.enqueue(item);
      res.statusCode = 200;
      res.end();
    } catch (err) {
      res.statusCode = 400;
      res.end();
    }
  });
}

const webServer = http.createServer(onRequest);

function startWebServer(webChannel: WebChannel, port: number): Promise<void> {
  webServerStarted = true;

  webServer.listen(port);

  function onError(err) {
    webChannel.emit('error', err);
  }

  onWebServerError = onError;
  webServer.on('error', onError);
  webServer.on('connection', onWebServerConnection);

  return new Promise((resolve) => {
    webServer.once('listening', resolve);
  });
}

function stopWebServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!webServerStarted) {
      resolve();
      return;
    }

    webServer.once('close', (err) => {
      if (onWebServerError) webServer.removeListener('error', onWebServerError);
      onWebServerError = undefined;
      webServerStarted = false;

      if (err) {
        reject(err);
        return;
      }
      resolve();
    });

    webServer.close();
    webServerSockets.forEach((socket) => socket.destroy());
  });
}

/**
 * TODO documentation
 */
class WebChannel extends Channel {
  protected path: string;

  public static PORT: number = 3000;

  constructor(path: string) {
    super();

    this.path = path;
  }

  async start(): Promise<void> {
    // return if the WebChannel already started
    if (this.started) return;

    await super.start();

    if (webChannels[this.path]) {
      throw new Error('That WebChannel path already exists.');
    }
    webChannels[this.path] = this;

    // start up the web server if its not already started
    if (!webServerStarted) await startWebServer(this, WebChannel.PORT);
  }

  async stop(): Promise<void> {
    delete webChannels[this.path];
    if (Object.keys(webChannels).length === 0) {
      await stopWebServer();
    }
    await super.stop();
  }
}

export default WebChannel;
