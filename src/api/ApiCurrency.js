const { Currency } = require('../model')

class ApiCurrency {
  constructor(client, opts) {
    this.client = client;
  }

  // List currencies that ordered by name.
  async list({ offset = 0, limit = 10 } = {}) {
    const result = await this.client.call(`/currencies?offset=${offset}&limit=${limit}`);
    return {
      total: result.total,
      items: result.items.map(item => new Currency(item, this.client))
    };
  }

  // Create a new currency. Note, administrator privilege is required.
  async add(currency) {
    throw new Error('currency.add is not implemented.');
  }

  // Get currency of specified currency name or id.
  async get(nameOrId) {
    const result = await this.client.call(`/currencies/${nameOrId}`);
    return new Currency(result, this.client);
  }
}

module.exports = ApiCurrency;
