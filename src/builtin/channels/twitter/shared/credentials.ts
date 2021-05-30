/**
 * A collection of secrets and keys required for access to the Twitter v2 API.
 */
export default interface TwitterCredentials {
  consumerKey: string;

  consumerSecret: string;

  apiKey?: string;

  apiSecret?: string;
}
