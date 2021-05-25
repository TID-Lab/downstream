import SocialMediaPost, { Platform } from '../../../post';

/**
 * Parse a raw Twitter post into a SocialMediaPost.
 */
export default function parse(
  rawPost: { [key: string]: any },
  includes: { [key: string]: any },
  matchingRules?: { [key: string]: any }[],
): SocialMediaPost {
  const { users = [] } = includes;
  const user:{ [key: string]: any } = users.find(
    (u) => u.id.toString() === rawPost.author_id.toString(),
  );
  // store the author user object in the raw post
  const now:Date = new Date();
  const author:string = user ? user.username : null;
  const authoredAt:Date = new Date(rawPost.created_at);
  const url = `https://twitter.com/${author}/status/${rawPost.id}`;
  return new SocialMediaPost({
    authoredAt,
    fetchedAt: now,
    author,
    content: rawPost.text,
    url,
    platform: Platform.Twitter,
    platformID: rawPost.id,
    raw: {
      post: rawPost,
      user,
      matchingRules,
    },
  });
}
