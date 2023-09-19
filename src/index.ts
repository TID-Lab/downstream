import Downstream from './downstream';
import Channel from './channels/channel';
import PollChannel from './channels/poll';
import PageChannel from './channels/page';
import WebChannel from './channels/web';

import {
  CrowdTangleChannel,
  CrowdTangleFacebookChannel,
  CrowdTangleInstagramChannel,
  TwitterPageChannel,
  TwitterStreamChannel,
  JunkipediaChannel,
} from './builtin/channels';

const builtin = {
  CrowdTangleChannel,
  CrowdTangleFacebookChannel,
  CrowdTangleInstagramChannel,
  TwitterPageChannel,
  TwitterStreamChannel,
  JunkipediaChannel,
};

export {
  Downstream, Channel, PollChannel, PageChannel, WebChannel, builtin,
};
