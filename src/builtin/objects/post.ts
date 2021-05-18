import { TimestampedItem } from '../../channels/page';

interface Options {
  authoredAt: Date;
  fetchedAt: Date;
  author: string;
  url: string;
  platformID: string;
  content?: string;
  raw: { [key: string]: any };
  from?: string;
}

/**
 * TODO documentation
 */
class SocialMediaPost implements TimestampedItem {
  authoredAt: Date;

  fetchedAt: Date;

  author: string;

  url: string;

  platformID: string;

  content?: string;

  raw: { [key: string]: any };

  from?: string;

  constructor(options: Options) {
    this.authoredAt = options.authoredAt;
    this.fetchedAt = options.fetchedAt;
    this.author = options.author;
    this.url = options.url;
    this.platformID = options.platformID;
    this.raw = options.raw;
    this.from = options.from;
  }

  getTimestamp(): Date {
    return this.authoredAt;
  }
}

export default SocialMediaPost;
