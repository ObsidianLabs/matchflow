class ApiMarket {
  constructor(client, opts) {
    this.client = client;
  }

  // Get the latest trade of specified product.
  async lastTrade(product) {
    const result = await this.client.call(`/market/trades/latest?product=${product}`);
    return result;
  }

  // Get the latest closing price of specified product name.
  async closingPrice(product) {
    const result = await this.client.call(`/market/trades/latestclosingprice?product=${product}`);
    return result;
  }

  // List trades of specified product in time descending order.
  async trades(product) {
    const result = await this.client.call(`/market/trades?product=${product}&limit=20`);
    return result;
  }

  // List ticks of specified granularity.
  async ticks(product, period = '1min') {
    const result = await this.client.call(`/market/tickers?product=${product}&period=${period}&endTimestamp=0&limit=150`);
    return result;
  }

  // Get the merged tick in the last 24 hours for specified product.
  async mergedTicks(product) {
    const result = await this.client.call(`/market/tickers/merged/${product}`);
    return result;
  }

  // Get the price aggregated depth for the specified product.
  async depth(product) {
    const result = await this.client.call(`/market/depth?product=${product}&depth=5&step=0`);
    return result;
  }
}

module.exports = ApiMarket;
