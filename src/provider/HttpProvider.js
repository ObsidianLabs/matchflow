const superagent = require('superagent');
const BaseProvider = require('./BaseProvider');

/**
 * Http protocol json rpc provider.
 */
class HttpProvider extends BaseProvider {
  /**
   * @param url {string} - Full json rpc http url
   * @param [options] {object} - See [BaseProvider.constructor](#provider/BaseProvider.js/constructor)
   * @return {HttpProvider}
   *
   * @example
   * > const provider = new HttpProvider('http://testnet-jsonrpc.conflux-chain.org:12537', {logger: console});
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(url, options) {
    super(url, options);
  }

  /**
   * Call a json rpc method with params
   *
   * @param method {string} - Json rpc method name.
   * @param [params] {array} - Json rpc method params.
   * @return {Promise<*>} Json rpc method return value.
   *
   * @example
   * > await provider.call('cfx_epochNumber');
   * > await provider.call('cfx_getBlockByHash', blockHash);
   */
  async call(pathname, method = 'GET', body) {
    const startTime = Date.now();

    // const data = { jsonrpc: '2.0', id: this.requestId(), method, params };

    let request;
    if (method === 'GET') {
      request = superagent.get(this.url + pathname);
    } else if (method === 'POST') {
      request = superagent.post(this.url + pathname)
        .send(body)
        .set('Accept', 'application/json');
    } else {
      throw new Error('Unsupported method.');
    }

    const { body: { success, message, data } = {} } = await request.timeout(this.timeout);

    if (!success) {
      this.logger.error({ pathname, error: message, duration: Date.now() - startTime });
      throw new BaseProvider.RPCError(message);
    } else {
      this.logger.info({ pathname, data, duration: Date.now() - startTime });
    }

    return data;
  }
}

module.exports = HttpProvider;
