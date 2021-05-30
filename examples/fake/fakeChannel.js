const { PollChannel } = require('downstream');
const axios = require('axios').default;

/**
 * A Channel that polls our fake API.
 */
class FakeChannel extends PollChannel {

    async fetch() {
        // fetch a post from our fake API
        const res = await axios({
            method: 'GET',
            baseURL: 'http://localhost:3000',
            url: '/api/posts'
        });
        const post = res.data;

        // enqueue it so that Downstream can dequeue it later
        this.enqueue(post);
    }

}

module.exports = FakeChannel;