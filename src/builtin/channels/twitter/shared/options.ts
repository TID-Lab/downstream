import TwitterCredentials from './credentials';

export default interface TwitterOptions {
  queryParams?: { [key: string]: any };
  credentials: TwitterCredentials;
}
