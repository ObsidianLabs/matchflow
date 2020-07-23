const { RemoteOrder } = require('../model')

class ApiOrder {
  constructor(client, opts) {
    this.client = client;
  }

  // Place a new order and send to the exchange to be matched.
  async place(signedOrder) {
    const result = await this.client.call(`/orders/place`, 'POST', signedOrder);
    return result
  }

  // Submit a request to cancel an order.
  async cancel(orderId, signature) {
    const result = await this.client.call(`/orders/${orderId}/cancel`, 'POST', signature);
    return result
  }

  // Submit a request to cancel an order by client order ID.
  async cancelByClientOrderId(address, clientOrderId) {
    throw new Error('order.cancelByClientOrderId is not implemented.');
  }

  // Get order.
  async get(orderId) {
    const result = await this.client.call(`/orders/${orderId}`);
    return new RemoteOrder(result, this.client);
  }

  // Get order by client order ID.
  async getByClientOrderId(address, clientOrderId) {
    const result = await this.client.call(`/orders/${address}/${clientOrderId}`);
    return result;
  }

  // Get order cancellation details
  async cancelDetail(orderId) {
    const result = await this.client.call(`/orders/${orderId}/cancel/detail`);
    return result;
  }

  // Get user opened orders of specified product or all products.
  async openOrders(address, product) {
    const result = await this.client.call(`/orders/open?address=${address}&product=${product}&offset=0&limit=100&asc=true`);
    return result.map(item => new RemoteOrder(item, this.client));
  }

  // Get user incompleted orders of specified product or all products, including new submitted, opened, pending and canceling orders.
  async incompleteOrders(address, product) {
    const result = await this.client.call(`/orders/incompleted?address=${address}&product=${product}&status=&offset=0&limit=100&asc=true`);
    return result.map(item => new RemoteOrder(item, this.client));
  }

  // Get user completed (filled or cancelled) orders of specified product or all products.
  async completeOrders(address, product) {
    const result = await this.client.call(`/orders/completed?address=${address}&product=${product}&side=&startTimestamp=0&endTimestamp=0&offset=0&limit=100&asc=true`);
    return result.map(item => new RemoteOrder(item, this.client));
  }

  // Get user orders of specified product or all products.
  async orders(address, product) {
    const result = await this.client.call(`/orders?address=${address}&product=${product}&startTimestamp=0&endTimestamp=0&offset=0&limit=100&asc=true`);
    return result.map(item => new RemoteOrder(item, this.client));
  }

  async orderTrades(orderId) {
    const result = await this.client.call(`/orders/${orderId}/matches?offset=0&limit=10`);
    return result;
  }

  async trades(address, product) {
    const result = await this.client.call(`/orders/matches?address=${address}&product=${product}&startTimestamp=0&endTimestamp=0&offset=0&limit=100&asc=true`);
    return result;
  }
}

module.exports = ApiOrder;
