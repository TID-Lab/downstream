import Downstream from './downstream';
import Channel from './channels/channel';
import PageChannel from './channels/page';
import PollChannel from './channels/poll';

import {
  CrowdTangleChannel,
  CrowdTangleFacebookChannel,
  CrowdTangleInstagramChannel,
  TwitterPageChannel,
  TwitterStreamChannel,
} from './builtin/channels';

const builtin = {
  CrowdTangleChannel,
  CrowdTangleFacebookChannel,
  CrowdTangleInstagramChannel,
  TwitterPageChannel,
  TwitterStreamChannel,
};

export {
  Downstream, Channel, PageChannel, PollChannel, builtin,
};
