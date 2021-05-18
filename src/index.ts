import Engine from './engine';
import Item from './item';
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
  Engine, Item, Channel, PageChannel, PollChannel, builtin,
};
