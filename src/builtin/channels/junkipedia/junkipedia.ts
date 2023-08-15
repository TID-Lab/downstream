import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import SocialMediaPost from '../../post';
import PageChannel, { PageOptions } from '../../../channels/page';
import hash from '../../../util/hash';

export interface JunkipediaOptions extends PageOptions {
  apiKey: string;
  queryParams?: { [key: string]: any };
  nextPageURL?: string;
}

/**
 * A built-in Channel for aggregating posts as SocialMediaPosts
 * from a Junkipedia list.
 */
class JunkipediaChannel extends PageChannel {
  private static BASE_URL:string = 'https://www.junkipedia.org';

  protected static INTERVAL:number = 10000;

  private static PER_PAGE:number = 100;

  protected apiKey: string;

  protected nextPageURL?: string;

  protected queryParams: { [key: string]: any };

  /**
   * Initializes a new JunkipediaListChannel.
   */
  constructor(options:JunkipediaOptions) {
    super({
      ...options,
      namespace: options.namespace || `junkipedia-${hash(options.apiKey)}`,
    });

    const queryParams:{ [key: string]: any } = options.queryParams || {};

    // initialize JunkipediaListChannel variables
    if (!options.apiKey) {
      throw new Error('The `apiKey` field is required.');
    }

    this.apiKey = options.apiKey;
    this.nextPageURL = options.nextPageURL;
    this.queryParams = {
      ...(queryParams || {}),
      per_page: queryParams.count || JunkipediaChannel.PER_PAGE,
    };
    this.interval = options.interval || JunkipediaChannel.INTERVAL;
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

    const apiRoute = '/api/v1/posts/';

    // send an HTTP request to the Junkipedia API
    let config:AxiosRequestConfig = {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    if (this.nextPageURL) {
      config = {
        ...config,
        url: this.nextPageURL,
      };
    } else {
      config = {
        ...config,
        baseURL: JunkipediaChannel.BASE_URL,
        url: apiRoute,
        params: {
          ...this.queryParams,
          published_at_from: Math.round(startDate.getTime() / 1000),
          published_at_to: Math.round(new Date().getTime() / 1000),
        },
      };
    }

    const response:AxiosResponse = await axios(config);

    // parse raw post data from the HTTP response into SocialMediaPosts
    const { data: { data: rawPosts } } = response;
    const posts:SocialMediaPost[] = [];
    for (let i:number = 0; i < rawPosts.length; i += 1) {
      const rawPost = rawPosts[i];
      const post:SocialMediaPost = this.parse(rawPost);
      posts.push(post);
    }

    // update nextPageURL with the new value from Junkipedia
    const { data: { links } } = response;
    this.nextPageURL = links.next;

    return posts;
  }

  /**
   * Parse the given raw post into a SocialMediaPost.
   */
  protected parse(rawPost: { [key: string]: any }): SocialMediaPost {
    const { attributes } = rawPost;
    const { search_data_fields: searchDataFields } = attributes;
    const now:Date = new Date();
    const author:string = searchDataFields.channel_name;
    const authoredAt:Date = new Date(attributes.published_at) || now;
    const platform = searchDataFields.platform_name.toLowerCase();
    const content = searchDataFields.description;

    return new SocialMediaPost({
      authoredAt,
      fetchedAt: now,
      author,
      content,
      url: attributes.url,
      platform,
      platformID: attributes.post_uid,
      raw: rawPost,
    });
  }
}

export default JunkipediaChannel;
