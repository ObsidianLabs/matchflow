const pick = require('lodash/pick')
const BN = require('bignumber.js')
const sigUtil = require('cfx-sig-util')

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]
const order = [
  { name: 'userAddress', type: 'address' },
  { name: 'amount', type: 'uint256' },
  { name: 'price', type: 'uint256' },
  { name: 'orderType', type: 'uint256' },
  { name: 'side', type: 'bool' },
  { name: 'salt', type: 'uint256' },
  { name: 'baseAssetAddress', type: 'address' },
  { name: 'quoteAssetAddress', type: 'address' },
  { name: 'feeAddress', type: 'address' },
  { name: 'makerFeePercentage', type: 'uint256' },
  { name: 'takerFeePercentage', type: 'uint256' },
]

class RemoteOrder {
  constructor({
    id,
    clientOrderId,
    productId,
    amount,
    price,
    type,
    side,
    feeAddress,
    feeRateMaker,
    feeRateTaker,
    timestamp,
    ...rest
  }, client) {
    this.id = id;
    this.clientOrderId = clientOrderId;
    this.productId = productId;
    this.amount = amount;
    this.price = price;
    this.type = type;
    this.side = side;
    this.feeAddress = feeAddress;
    this.feeRateMaker = feeRateMaker;
    this.feeRateTaker = feeRateTaker;
    this.timestamp = timestamp;
    this.rest = rest;
    this.client = client;
  }

  async getTypedData(account, timestamp) {
    const product = await this.client.product.getById(this.productId)
    const baseCurrency = await product.baseCurrency()
    const quoteCurrency = await product.quoteCurrency()
    const orderData = {
      userAddress: account.address,
      amount: BN(this.amount).times(BN(1e18)).toFixed(),
      price: this.type === 'Limit' ? BN(this.price).times(BN(1e18)).toFixed() : 0,
      orderType: this.type === 'Limit' ? 0 : 1,
      side: this.side === 'Buy',
      salt: this.timestamp,
      baseAssetAddress: baseCurrency.contractAddress,
      quoteAssetAddress: quoteCurrency.contractAddress,
      feeAddress: this.feeAddress,
      makerFeePercentage: BN(this.feeRateMaker).times(BN(1e18)).toFixed(),
      takerFeePercentage: BN(this.feeRateTaker).times(BN(1e18)).toFixed()
    }
    const typedData = {
      types: {
        EIP712Domain,
        CancelRequest: [
          { name: 'order', type: 'Order' },
          { name: 'nonce', type: 'uint256' },
        ],
        Order: order
      },
      primaryType: 'CancelRequest',
      domain: {
        name: 'Boomflow',
        version: '1.0',
        chainId: 2,
        verifyingContract: await this.client.common.boomflow()
      },
      message: {
        order: orderData,
        nonce: timestamp
      }
    }
    return typedData
  }

  async sign(account) {
    const timestamp = new Date().getTime()
    const data = await this.getTypedData(account, timestamp)
    const signature = sigUtil.signTypedData_v4(Buffer.from(account.privateKey.slice(2), 'hex'), { data })
    return {
      timestamp,
      signature,
    }
  }

  async cancel (account) {
    const signature = await this.sign(account)
    return this.client.order.cancel(this.id, signature)
  }
}

module.exports = RemoteOrder;
