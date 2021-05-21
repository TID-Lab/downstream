import TwitterCredentials from './credentials';

/**
 * TODO documentation
 */
export default interface TwitterOptions {
  queryParams?: { [key: string]: any };
  credentials: TwitterCredentials;
}
