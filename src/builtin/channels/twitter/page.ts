import Twitter from 'twitter-v2';
import SocialMediaPost from '../../post';
import PageChannel from '../../../channels/page';
import TwitterCredentials from './shared/credentials';
import { TWEET_FIELDS, USER_FIELDS, EXPANSIONS } from './shared/params';
import parse from './shared/parse';

/**
 * TODO documentation
 */
export interface Options {
  lastTimestamp?: Date;
  delay?: number;
  queryParams?: { [key: string]: any };
  credentials: TwitterCredentials;
  isRecent?: boolean;
  nextPageToken?: string;
  interval?: number;
}

class TwitterPageChannel extends PageChannel {
  private static RECENT_INTERVAL:number = 2000;

  private static ALL_INTERVAL:number = 3000;

  private static MAX_RESULTS:number = 100;

  protected twitter: Twitter;

  protected nextPageToken?: string;

  protected isRecent: boolean;

  protected queryParams: { [key: string]: any };

  protected cachedQueryParams?: { [key: string]: any };

  constructor(options: Options) {
    super({
      lastTimestamp: options.lastTimestamp,
      delay: options.delay,
    });

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

    this.nextPageToken = options.nextPageToken;
    this.isRecent = options.isRecent || false;
    this.queryParams = {
      expansions: queryParams.expansions || EXPANSIONS.join(','),
      'tweet.fields': queryParams['tweet.fields'] || TWEET_FIELDS.join(','),
      'user.fields': queryParams['user.fields'] || USER_FIELDS.join(','),
      max_results: queryParams.max_results || TwitterPageChannel.MAX_RESULTS,
      ...(queryParams || {}),
    };

    let interval;
    if (this.isRecent) {
      interval = TwitterPageChannel.RECENT_INTERVAL;
    } else {
      interval = TwitterPageChannel.ALL_INTERVAL;
    }
    this.interval = interval;
  }

  /**
   * Assemble the query parameters for a Twitter API call.
   */
  protected assembleQueryParams(): { [key: string]: any } {
    // compute the startDate for pagination
    let startDate:Date;
    if (this.lastTimestamp) {
      // if lastTimestamp is available, use that
      startDate = new Date(this.lastTimestamp.getTime() + 1000);
    } else {
      // otherwise, set start date to 3 hours ago
      startDate = new Date();
      startDate.setHours(startDate.getHours() - 3);
    }

    // use cached query params if nextToken is defined
    let queryParams:{ [key: string]: any };
    if (!this.nextPageToken) {
      queryParams = {
        ...this.queryParams,
        start_time: startDate.toISOString(),
      };
    } else {
      queryParams = {
        ...this.cachedQueryParams,
        next_token: this.nextPageToken,
      };
    }

    return queryParams;
  }

  async fetchPage(): Promise<SocialMediaPost[]> {
    // assemble the query parameters
    const queryParams:{ [key: string]: any } = this.assembleQueryParams();

    // send an HTTP request to the Twitter API
    const routeSuffix:string = (this.isRecent) ? 'recent' : 'all';

    const body = await this.twitter.get(`tweets/search/${routeSuffix}`, queryParams);

    // parse raw post data from the HTTP response into SocialMediaPosts
    const posts:SocialMediaPost[] = [];
    if (body && typeof body === 'object') {
      const responseBody:any = body;

      const { data: rawPosts, includes, meta } = responseBody;
      for (let i = 0; i < meta.result_count; i += 1) {
        const rawPost = rawPosts[i];
        const post:SocialMediaPost = parse(rawPost, includes);
        posts.push(post);
      }

      // update nextToken with the new value from Twitter
      this.nextPageToken = meta.next_token;

      // if nextToken is defined, cache query params for the next call
      if (this.nextPageToken) this.cachedQueryParams = queryParams;
    }
    return posts;
  }
}

export default TwitterPageChannel;
