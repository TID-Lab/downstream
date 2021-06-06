const { PollChannel } = require('downstream');
const axios = require('axios').default;

/**
 * A Channel that polls our fruit API.
 */
class FruitChannel extends PollChannel {

  constructor(options) {
    super(
      {
        ...options,
        namespace: 'fruit',
      }
    );
  }

  async fetch() {
      // fetch a post from our fake API
      const res = await axios({
          method: 'GET',
          baseURL: 'http://localhost:3000',
          url: '/api/fruits'
      });
      const fruit = res.data;

      // enqueue it so that Downstream can dequeue it later
      this.enqueue(fruit);
  }

}

module.exports = FruitChannel;