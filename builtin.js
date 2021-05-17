// Sets up the `downstream/builtin` import path.

const {
  CrowdTangleChannel,
  CrowdTangleFacebookChannel,
  CrowdTangleInstagramChannel,
  TwitterPageChannel,
  TwitterStreamChannel,
} = require('./build/builtin/channels');

export {
  CrowdTangleChannel, CrowdTangleFacebookChannel, CrowdTangleInstagramChannel,
  TwitterPageChannel, TwitterStreamChannel,
};
