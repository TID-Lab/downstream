import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import SocialMediaPost from '../../post';
import PageChannel from '../../../channels/page';

export interface Options {
  lastTimestamp?: Date;
  queryParams?: { [key: string]: any };
  dashboardToken: string;
  isCrossPlatform?: boolean;
  nextPageURL?: string;
  interval?: number;
}

class CrowdTangleChannel extends PageChannel {
  private static BASE_URL:string = 'https://api.crowdtangle.com/';

  private static SORT_BY:string = 'date';

  protected static INTERVAL:number = 10000;

  private static COUNT:number = 100;

  private static LANGUAGE:string = 'en';

  protected dashboardToken: string;

  protected isCrossPlatform: boolean;

  protected nextPageURL?: string;

  protected queryParams: { [key: string]: any };

  constructor(options:Options) {
    super(options.lastTimestamp);

    const queryParams:{ [key: string]: any } = options.queryParams || {};

    // initialize CrowdTangleChannel variables
    if (!options.dashboardToken) {
      throw new Error('The `dashboardToken` field is required.');
    }

    this.dashboardToken = options.dashboardToken;
    this.isCrossPlatform = options.isCrossPlatform || false;
    this.nextPageURL = options.nextPageURL;
    this.queryParams = {
      ...(queryParams || {}),
      sortBy: queryParams.sortBy || CrowdTangleChannel.SORT_BY,
      count: queryParams.count || CrowdTangleChannel.COUNT,
      language: queryParams.language || CrowdTangleChannel.LANGUAGE,
    };
    this.interval = options.interval || CrowdTangleChannel.INTERVAL;
  }

  async fetchPage(): Promise<SocialMediaPost[]> {
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

    // compute variables dependent on the `crossPlatform` flag
    let apiRoute:string;
    let platforms:string|undefined;
    if (this.isCrossPlatform) {
      apiRoute = '/posts/search';
      platforms = this.queryParams.platforms;
    } else {
      apiRoute = '/posts';
    }

    // send an HTTP request to the CrowdTangle API
    let config:AxiosRequestConfig = { method: 'GET' };
    if (this.nextPageURL) {
      config = {
        ...config,
        url: this.nextPageURL,
      };
    } else {
      config = {
        ...config,
        baseURL: CrowdTangleChannel.BASE_URL,
        url: apiRoute,
        params: {
          ...this.queryParams,
          token: this.dashboardToken,
          platforms,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      };
    }

    const response:AxiosResponse = await axios(config);

    // parse raw post data from the HTTP response into SocialMediaPosts
    const { data: { result } } = response;
    const { posts: rawPosts } = result;
    const posts:SocialMediaPost[] = [];
    for (let i:number = 0; i < rawPosts.length; i += 1) {
      const rawPost = rawPosts[i];
      const post:SocialMediaPost = this.parse(rawPost);
      posts.push(post);
    }

    // update nextPageURL with the new value from CrowdTangle
    const { pagination } = result;
    this.nextPageURL = pagination.nextPage;

    return posts;
  }

  /**
   * Parse the given raw post into a SocialMediaPost.
   */
  parse(rawPost: { [key: string]: any }): SocialMediaPost {
    const now:Date = new Date();
    const author:string = rawPost.account ? rawPost.account.name || rawPost.account.handle : null;
    const authoredAt:Date = new Date(`${rawPost.date} UTC`) || now;
    let content;

    switch (rawPost.platform) {
      case 'facebook':
        content = rawPost.message;
        break;
      case 'instagram':
        content = rawPost.description;
        break;
      // TODO case 'reddit':
      default:
    }

    return new SocialMediaPost({
      authoredAt,
      fetchedAt: now,
      author,
      content,
      url: rawPost.postUrl,
      platformID: rawPost.id,
      raw: rawPost,
    });
  }
}

export default CrowdTangleChannel;
