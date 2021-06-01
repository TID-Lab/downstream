import { ChannelOptions } from '../../../../channels/channel';
import TwitterCredentials from './credentials';

export default interface TwitterOptions extends ChannelOptions {
  queryParams?: { [key: string]: any };
  credentials: TwitterCredentials;
}
