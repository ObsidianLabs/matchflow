const { User } = require('../model')

class ApiUser {
  constructor(client, opts) {
    this.client = client;
  }

  // Get user
  async get(address) {
    const result = await this.client.call(`/users/${address}`);
    return new User({ ...result, address }, this.client);
  }
}

module.exports = ApiUser;
