import CrowdTangleChannel, { CrowdTangleOptions } from './crowdtangle';

/**
 * A built-in Channel for aggregating Facebook posts as SocialMediaPosts.
 */
class CrowdTangleFacebookChannel extends CrowdTangleChannel {
  constructor(options: CrowdTangleOptions) {
    super(options);

    // set the CrowdTangle platform parameter to Facebook
    this.queryParams.platforms = 'facebook';
  }
}

export default CrowdTangleFacebookChannel;
