import { TimestampedItem } from '../channels/page';

/**
 * A social media platform.
 */
export const enum Platform {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Twitter = 'twitter',
}

interface SocialMediaOptions {
  authoredAt: Date;
  fetchedAt: Date;
  author: string;
  url: string;
  platform: Platform;
  platformID: string;
  content?: string;
  raw: { [key: string]: any };
}

/**
 * Represents a post on a social media platform.
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

  tags?: string[];

  constructor(options: SocialMediaOptions) {
    this.authoredAt = options.authoredAt;
    this.fetchedAt = options.fetchedAt;
    this.author = options.author;
    this.url = options.url;
    this.platform = options.platform;
    this.platformID = options.platformID;
    this.content = options.content;
    this.raw = options.raw;
  }

  getTimestamp(): Date {
    return this.authoredAt;
  }
}

export default SocialMediaPost;
