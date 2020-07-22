const Order = require('./Order')

class User {
  constructor ({
    id,
    name,
    address,
  }, client) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.client = client;
  }

  async account (currency) {
    return this.client.account.getAccount(this.address, currency);
  }

  async accounts () {
    return this.client.account.getAccounts(this.address);
  }

  buy (product, { amount }) {
    return Order.Buy(this.address, product, { amount }, this.client)
  }

  sell (product, { amount }) {
    return Order.Sell(this.address, product, { amount }, this.client)
  }

  limitBuy (product, { price, amount }) {
    return Order.LimitBuy(this.address, product, { price, amount }, this.client)
  }

  limitSell (product, { price, amount }) {
    return Order.LimitSell(this.address, product, { price, amount }, this.client)
  }

  async openOrders (product = {}) {
    return this.client.order.openOrders(this.address, product.name || '');
  }

  async incompleteOrders (product = {}) {
    return this.client.order.incompleteOrders(this.address, product.name || '');
  }

  async completeOrders (product = {}) {
    return this.client.order.completeOrders(this.address, product.name || '');
  }

  async orders (product = {}) {
    return this.client.order.orders(this.address, product.name || '');
  }

  async trades (product) {
    return this.client.order.trades(this.address, product.name);
  }
}

module.exports = User;