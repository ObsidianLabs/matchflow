class ApiCommon {
  constructor(client, opts) {
    this.client = client;
  }

  // Get system timestamp.
  async timestamp() {
    const result = await this.client.call(`/common/timestamp`);
    return new Date(result);
  }

  // Get system timezone ID
  async timezone() {
    return this.client.call(`/common/timezone`);
  }

  // Get Boomflow address
  async boomflow() {
    return this.client.call(`/common/boomflow`);
  }
}

module.exports = ApiCommon;
