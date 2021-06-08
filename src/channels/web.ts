import http from 'http';
import type { Socket } from 'net';
import { URL } from 'url';
import Item from '../item';
import Channel, { ChannelOptions } from './channel';

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
      const item = webChannel.parse(Buffer.concat(chunks));
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

export interface WebOptions extends ChannelOptions {
  path: string;
}

/**
 * A Channel that receives Items via its mounted path on a background HTTP server.
 */
class WebChannel extends Channel {
  protected path: string;

  public static PORT: number = 3000;

  constructor(options: WebOptions) {
    super(options);

    this.path = options.path;
  }

  /**
   * Mounts this WebChannel on the background HTTP server using its path.
   * Starts the HTTP server in the background if no other WebChannels have started yet.
   */
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

  /**
   * Unmounts this WebChannel from the background HTTP server.
   * Stops the HTTP server running in the background if no other WebChannels are still active.
   */
  async stop(): Promise<void> {
    delete webChannels[this.path];
    if (Object.keys(webChannels).length === 0) {
      await stopWebServer();
    }
    await super.stop();
  }

  /**
   * Parses an Item from a HTTP request body buffer.
   */
  parse(body: Buffer): Item {
    return JSON.parse(body.toString());
  }
}

export default WebChannel;
