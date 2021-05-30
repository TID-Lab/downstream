const SocialMediaPost = require('./model');

/**
 * Saves each tweet to a database.
 */
module.exports = async function saveToDatabase(data, next) {
  const post = new SocialMediaPost(data);
  await post.save();
  await next();
};
