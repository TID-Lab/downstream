/**
 * An example that uses every built-in Channel available to aggregate
 * social media posts about dogs across Facebook, Instagram, and Twitter.
 * Each dog post will be logged to the console so that you can go
 * "awwwwwwwwww" (or maybe not, that's cool too).
 */

 const { Downstream, builtin } = require('downstream');

 const {
     CrowdTangleChannel,
     CrowdTangleFacebookChannel,
     CrowdTangleInstagramChannel,
     TwitterPageChannel,
     TwitterStreamChannel
 } = builtin;
 
 // keys, tokens, and secrets
 const facebookToken = process.env.FACEBOOK_DASHBOARD_TOKEN;
 const instagramToken = process.env.INSTAGRAM_DASHBOARD_TOKEN;
 const twitterCredentials = {
     consumerKey: process.env.TWITTER_CONSUMER_KEY,
     consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
 };
 
 /**
  * Aggregates posts about dogs across all of Facebook & Instagram.
  * 
  * Requires:
  * - a CrowdTangle dashboard token
  * - granted access to the /posts/search API endpoint
  */
 const crowdtangleChannel = new CrowdTangleChannel({
     dashboardToken: facebookToken, // instagramToken also eligible
     isCrossPlatform: true,
     queryParams: {
         platforms: 'facebook,instagram',
         searchTerm: 'dog'
     }
 });
 
 /**
  * Aggregates Facebook posts about dogs authored by the accounts in your dashboard Lists.
  * 
  * Requires:
  * - a CrowdTangle *Facebook* dashboard token
  */
 const facebookChannel = new CrowdTangleFacebookChannel({
     dashboardToken: facebookToken,
     queryParams: {
         searchTerm: 'dog',
     }
 });
 
 /**
  * Aggregates Instagram posts about dogs authored by the accounts in your dashboard Lists.
  * 
  * Requires:
  * - a CrowdTangle *Instagram* dashboard token
  */
  const instagramChannel = new CrowdTangleInstagramChannel({
     dashboardToken: instagramToken,
     queryParams: {
         searchTerm: 'dog',
     }
 });
 
 /**
  * Aggregates tweets about dogs authored in the last seven days.
  * 
  * Requires:
  * - Twitter v2 API credentials & "Standard" Track Access
  */
 const twitterPageChannel = new TwitterPageChannel({
     credentials: twitterCredentials,
     queryParams: {
         query: 'dogs'
     }
 });
 
 /**
  * Aggregates... whatever tweets you've configured your Twitter filtered stream to send your way ¯\_(ツ)_/¯
  * 
  * Downstream intentionally does not provide helper methods for configuring your Twitter stream rules.
  * For this channel to aggregate tweets about dogs, you'll have to configure a rule yourself!
  * 
  * Requires:
  * - Twitter v2 API credentials
  */
  const twitterStreamChannel = new TwitterStreamChannel({
     credentials: twitterCredentials,
 });
 
 const downstream = new Downstream();
 
 // register channels
 downstream.register(crowdtangleChannel);
 downstream.register(facebookChannel);
 downstream.register(instagramChannel);
 downstream.register(twitterPageChannel);
 downstream.register(twitterStreamChannel);
 
 // use hooks
 downstream.use(async (post, next) => {
 
     console.log(post); // log each dog post to the console
 
     await next();
 });
 
 // log any errors
 downstream.on('error', console.log);
 
 downstream.start();