import Engine from './engine';
import Channel from './channels/channel';
import PageChannel from './channels/page';
import PollChannel from './channels/poll';
import Report from './report';

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
  Engine, Channel, PageChannel, PollChannel, Report, builtin,
};
