import CrowdTangleChannel, { Options } from './crowdtangle';

/**
 * TODO documentation
 */
class CrowdTangleInstagramChannel extends CrowdTangleChannel {
  constructor(options: Options) {
    super(options);

    // set the CrowdTangle platform parameter to Instagram
    this.queryParams.platforms = 'instagram';
  }
}

export default CrowdTangleInstagramChannel;
