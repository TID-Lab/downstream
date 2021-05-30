import CrowdTangleChannel, { CrowdTangleOptions } from './crowdtangle';

/**
 * A built-in Channel for aggregating Instagram posts as SocialMediaPosts.
 */
class CrowdTangleInstagramChannel extends CrowdTangleChannel {
  constructor(options: CrowdTangleOptions) {
    super(options);

    // set the CrowdTangle platform parameter to Instagram
    this.queryParams.platforms = 'instagram';
  }
}

export default CrowdTangleInstagramChannel;
