class ApiAccount {
  constructor(client, opts) {
    this.client = client;
  }

  // Get account of specified user address and currency.
  async getAccount(address, currency) {
    const result = await this.client.call(`/accounts/${address}/${currency}`);
    return result;
  }

  // Get account of specified user address and currency.
  async getAccounts(address, { offset = 0, limit = 10 } = {}) {
    const result = await this.client.call(`/accounts/${address}?offset=${offset}&limit=${limit}`);
    return result;
  }

  // Withdraw
  async withdraw(body) {
    const result = await this.client.call(`/accounts/withdraw`, 'POST', body);
    return result
  }
}

module.exports = ApiAccount;