class Product {
  constructor ({
    id,
    name,
    baseCurrencyId,
    quoteCurrencyId,
    pricePrecision,
    amountPrecision,
    fundsPrecision,
    minOrderAmount,
    maxOrderAmount,
    minOrderFunds
  }, client) {
    this.id = id;
    this.name = name;
    this.baseCurrencyId = baseCurrencyId;
    this.quoteCurrencyId = quoteCurrencyId;
    this.pricePrecision = pricePrecision;
    this.amountPrecision = amountPrecision;
    this.fundsPrecision = fundsPrecision;
    this.minOrderAmount = minOrderAmount;
    this.maxOrderAmount = maxOrderAmount;
    this.minOrderFunds = minOrderFunds;
    this.client = client;

    this._baseCurrency = null
    this._quoteCurrency = null
  }

  async baseCurrency () {
    if (!this._baseCurrency) {
      this._baseCurrency = await this.client.currency.get(this.baseCurrencyId)
    }
    return this._baseCurrency
  }

  async quoteCurrency () {
    if (!this._quoteCurrency) {
      this._quoteCurrency = await this.client.currency.get(this.quoteCurrencyId)
    }
    return this._quoteCurrency
  }

  async dailyLimit () {
    return this.client.product.dailyLimit(this.name);
  }

  async dailyLimitRate() {
    return this.client.product.dailyLimitRate(this.name);
  }

  async lastTrade () {
    return this.client.market.lastTrade(this.name);
  }

  async closingPrice () {
    return this.client.market.closingPrice(this.name);
  }

  async trades () {
    return this.client.market.trades(this.name);
  }

  async ticks (period = '1min') {
    return this.client.market.ticks(this.name, period);
  }

  async mergedTicks () {
    return this.client.market.mergedTicks(this.name);
  }

  async depth () {
    return this.client.market.depth(this.name);
  }
}

module.exports = Product;