import Report from '../../../../report';

/**
 * Parse a raw Twitter post into a Report.
 */
export default function parse(
  rawPost: { [key: string]: any },
  includes: { [key: string]: any },
): Report {
  const { users = [] } = includes;
  const user:{ [key: string]: any } = users.find(
    (u) => u.id.toString() === rawPost.author_id.toString(),
  );
  // store the author user object in the raw post
  const now:Date = new Date();
  const author:string = user ? user.username : null;
  const authoredAt:Date = new Date(rawPost.created_at);
  const url = `https://twitter.com/${author}/status/${rawPost.id}`;
  return {
    authoredAt,
    fetchedAt: now,
    author,
    content: rawPost.text,
    url,
    platformID: rawPost.id,
    raw: {
      post: rawPost,
      user,
    },
  };
}
