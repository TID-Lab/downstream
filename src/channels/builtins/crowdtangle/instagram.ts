import CrowdTangleChannel, { CrowdTangleOptions } from './crowdtangle';

/**
 * TODO documentation
 */
class CrowdTangleInstagramChannel extends CrowdTangleChannel {
  constructor(options: CrowdTangleOptions) {
    super(options);

    // set the CrowdTangle platform parameter to Facebook
    this.queryParams.platforms = 'instagram';
  }
}

export default CrowdTangleInstagramChannel;