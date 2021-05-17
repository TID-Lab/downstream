/**
 * TODO documentation
 */
const TWEET_FIELDS:string[] = [
  'author_id',
  'created_at',
  'geo',
  'id',
  'referenced_tweets',
];

const USER_FIELDS:string[] = [
  'id',
  'location',
  'public_metrics',
  'username',
  'verified',
];

const EXPANSIONS:string[] = [
  'author_id',
];

export { TWEET_FIELDS, USER_FIELDS, EXPANSIONS };
