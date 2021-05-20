import { TimestampedItem } from '../channels/page';

export const enum Platform {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Twitter = 'twitter',
}

interface Options {
  authoredAt: Date;
  fetchedAt: Date;
  author: string;
  url: string;
  platform: Platform;
  platformID: string;
  content?: string;
  raw: { [key: string]: any };
  from?: string;
  tags?: string[];
}

/**
 * TODO documentation
 */
class SocialMediaPost implements TimestampedItem {
  authoredAt: Date;

  fetchedAt: Date;

  author: string;

  url: string;

  platform: Platform;

  platformID: string;

  content?: string;

  raw: { [key: string]: any };

  from?: string;

  tags?: string[];

  constructor(options: Options) {
    this.authoredAt = options.authoredAt;
    this.fetchedAt = options.fetchedAt;
    this.author = options.author;
    this.url = options.url;
    this.platform = options.platform;
    this.platformID = options.platformID;
    this.content = options.content;
    this.raw = options.raw;
    this.from = options.from;
    this.tags = options.tags;
  }

  getTimestamp(): Date {
    return this.authoredAt;
  }
}

export default SocialMediaPost;
