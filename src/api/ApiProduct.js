const { Product } = require('../model')

class ApiProduct {
  constructor(client, opts) {
    this.client = client;
  }

  // List products that ordered by name.
  async list({ offset = 0, limit = 10 } = {}) {
    const result = await this.client.call(`/products?offset=${offset}&limit=${limit}`);
    return {
      total: result.total,
      items: result.items.map(item => new Product(item, this.client))
    };
  }

  // Create a new product. Note, administrator privilege is required.
  async add(product) {
    throw new Error('products.add is not implemented.')
  }

  // Get product of specified product name.
  async get(name) {
    const result = await this.client.call(`/products/${name}`);
    return new Product(result, this.client);
  }

  // List daily limit of specified product name.
  async dailyLimit(name) {
    const result = await this.client.call(`/products/dailylimits/${name}`);
    return result;
  }

  // Get daily limit rate of specified product name.
  async dailyLimitRate(name) {
    const result = await this.client.call(`/products/dailylimitrate/${name}`);
    return result;
  }
}

module.exports = ApiProduct;
