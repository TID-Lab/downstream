import CrowdTangleChannel, { CrowdTangleOptions } from './crowdtangle';

/**
 * TODO documentation
 */
class CrowdTangleFacebookChannel extends CrowdTangleChannel {
  constructor(options: CrowdTangleOptions) {
    super(options);

    // set the CrowdTangle platform parameter to Facebook
    this.queryParams.platforms = 'facebook';
  }
}

export default CrowdTangleFacebookChannel;
