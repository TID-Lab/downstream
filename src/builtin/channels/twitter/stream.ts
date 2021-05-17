import Twitter from 'twitter-v2';
import type TwitterStream from 'twitter-v2/build/TwitterStream';
import Report from '../../../report';
import Channel from '../../../channels/channel';
import TwitterCredentials from './shared/credentials';
import { TWEET_FIELDS, USER_FIELDS, EXPANSIONS } from './shared/params';
import parse from './shared/parse';

/**
 * TODO documentation
 */
export interface TwitterStreamOptions {
  lastReportDate?: Date;
  queryParams?: { [key: string]: any };
  credentials: TwitterCredentials;
  isRecent?: boolean;
  nextPageToken?: string;
  interval?: number;
}

/**
 * TODO documentation
 */
class TwitterStreamChannel extends Channel {
  private static TIMEOUT_MULTIPLIER:number = 1000;

  private static TIMEOUT_CEILING:number = 300000; // 5 minutes

  protected twitter: Twitter;

  protected queryParams: { [key: string]: any };

  protected stream?: TwitterStream;

  protected consecutiveErrorCount: number;

  constructor(options:TwitterStreamOptions) {
    super();

    const {
      credentials,
      queryParams = {},
    } = options;

    // initialize TwitterPageChannel variables
    if (!credentials) {
      throw new Error('The `credentials` field is required.');
    }

    this.twitter = new Twitter({
      consumer_key: credentials.consumerKey,
      consumer_secret: credentials.consumerSecret,
    });

    this.queryParams = {
      expansions: queryParams.expansions || EXPANSIONS.join(','),
      'tweet.fields': queryParams['tweet.fields'] || TWEET_FIELDS.join(','),
      'user.fields': queryParams['user.fields'] || USER_FIELDS.join(','),
      ...(queryParams || {}),
    };

    this.consecutiveErrorCount = 0;
  }

  async start() {
    await super.start();

    // listen to the Twitter stream
    this.listenToStream();
  }

  async stop() {
    // close the Twitter stream
    if (this.stream) this.stream.close();
    await super.stop();
  }

  /**
   * Listen to the Twitter stream.
   */
  protected async listenToStream() {
    this.stream = this.twitter.stream('tweets/search/stream', this.queryParams);
    try {
      for await (const { data, includes } of this.stream) {
        // reset the consecutive error count
        this.consecutiveErrorCount = 0;

        const report:Report = parse(data, includes);
        this.enqueue(report);
      }
      // If the stream closed gracefully, reconnect.
      if (this.started) {
        this.listenToStream();
      }
    } catch (err) {
      this.emit('error', err);

      // if errors keep occurring, wait exponentially longer to reconnect
      let timeout:number = (
        (2 ** this.consecutiveErrorCount)
        * TwitterStreamChannel.TIMEOUT_MULTIPLIER
      );
      // ... (but with a ceiling, in case errors occur over several months)
      if (timeout > TwitterStreamChannel.TIMEOUT_CEILING) {
        timeout = TwitterStreamChannel.TIMEOUT_CEILING;
      } else {
        this.consecutiveErrorCount += 1;
      }
      setTimeout(this.listenToStream.bind(this), timeout);
    }
  }
}

export default TwitterStreamChannel;