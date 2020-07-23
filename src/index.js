const providerFactory = require('./provider');
const {
  ApiAccount,
  ApiCommon,
  ApiCurrency,
  ApiMarket,
  ApiOrder,
  ApiProduct,
  ApiSystem,
  ApiUser,
} = require('./api')

class MatchFlowClient {
  constructor({ network = 'testnet', ...rest }) {
    let url
    if (network === 'mainnet') {
      url = 'https://api.matchflow.io'
    } else if (network === 'testnet') {
      url = 'https://dev.matchflow.io'
    } else {
      throw new Error('Invalid network.')
    }

    this.provider = this.setProvider(url, rest);
    this._account = new ApiAccount(this, rest);
    this._common = new ApiCommon(this, rest);
    this._currency = new ApiCurrency(this, rest);
    this._market = new ApiMarket(this, rest);
    this._order = new ApiOrder(this, rest);
    this._product = new ApiProduct(this, rest);
    this._system = new ApiSystem(this, rest);
    this._user = new ApiUser(this, rest);
  }

  setProvider(url, options = {}) {
    if (!this.provider) {
      this.provider = providerFactory(url, options);
    } else if (url !== this.provider.url) {
      const provider = providerFactory(url, { ...this.provider, ...options });
      this.provider.close(); // close after factory create success
      this.provider = provider;
    } else {
      Object.assign(this.provider, options);
    }

    return this.provider;
  }

  async call(...params) {
    return this.provider.call(...params);
  }

  close() {
    if (this.provider) {
      this.provider.close();
    }
  }

  // Account management
  get account() {
    return this._account;
  }

  // Common information
  get common() {
    return this._common;
  }

  // Currency management
  get currency() {
    return this._currency;
  }

  // Market management
  get market() {
    return this._market;
  }

  // Order management
  get order() {
    return this._order;
  }

  // Product management
  get product() {
    return this._product;
  }

  // System management
  get system() {
    return this._system;
  }

  // User management
  get user() {
    return this._user;
  }
}

module.exports = MatchFlowClient;