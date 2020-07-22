const pick = require('lodash/pick')
const BN = require('bignumber.js')
const sigUtil = require('cfx-sig-util')

const domain = [
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

class Order {
  constructor({
    address,
    product,
    amount,
    price,
    type,
    side,
    feeAddress,
    feeRateMaker,
    feeRateTaker
  }, client) {
    this.address = address;
    this.product = product;
    this.amount = amount;
    this.price = price;
    this.type = type;
    this.side = side;
    this.feeAddress = feeAddress;
    this.feeRateMaker = feeRateMaker;
    this.feeRateTaker = feeRateTaker;
    this.client = client;
  }

  static Buy(address, product, { amount }, client) {
    return new Order({
      address,
      product,
      amount,
      price: '0',
      type: 'Market',
      side: 'Buy',
      feeAddress: address,
      feeRateMaker: 0,
      feeRateTaker: 0.0005
    }, client)
  }

  static LimitBuy(address, product, { price, amount }, client) {
    return new Order({
      address,
      product,
      amount,
      price,
      type: 'Limit',
      side: 'Buy',
      feeAddress: address,
      feeRateMaker: 0,
      feeRateTaker: 0.0005
    }, client)
  }

  static Sell(address, product, { amount }, client) {
    return new Order({
      address,
      product,
      amount,
      price: '0',
      type: 'Market',
      side: 'Sell',
      feeAddress: address,
      feeRateMaker: 0,
      feeRateTaker: 0.0005
    }, client)
  }

  static LimitSell(address, product, { price, amount }, client) {
    return new Order({
      address,
      product,
      amount,
      price,
      type: 'Limit',
      side: 'Sell',
      feeAddress: address,
      feeRateMaker: 0,
      feeRateTaker: 0.0005
    }, client)
  }

  async getTypedData(timestamp) {
    const baseCurrency = await this.product.baseCurrency()
    const quoteCurrency = await this.product.quoteCurrency()
    const message = {
      userAddress: this.address,
      amount: BN(this.amount).times(BN(1e18)).toFixed(),
      price: this.type === 'Limit' ? BN(this.price).times(BN(1e18)).toFixed() : 0,
      orderType: this.type === 'Limit' ? 0 : 1,
      side: this.side === 'Buy',
      salt: timestamp,
      baseAssetAddress: baseCurrency.contractAddress,
      quoteAssetAddress: quoteCurrency.contractAddress,
      feeAddress: this.feeAddress,
      makerFeePercentage: BN(this.feeRateMaker).times(BN(1e18)).toFixed(),
      takerFeePercentage: BN(this.feeRateTaker).times(BN(1e18)).toFixed()
    }
    const typedData = {
      types: {
        EIP712Domain: domain,
        Order: order
      },
      primaryType: 'Order',
      domain: {
        name: 'Boomflow',
        version: '1.0',
        chainId: 2,
        verifyingContract: await this.client.common.boomflow()
      },
      message
    }
    return typedData
  }

  async sign(account) {
    const timestamp = new Date().getTime()
    const data = await this.getTypedData(timestamp)
    const signature = sigUtil.signTypedData_v4(Buffer.from(account.privateKey.slice(2), 'hex'), { data })
    return {
      ...pick(this, ['address', 'type', 'side', 'price', 'amount', 'feeAddress', 'feeRateTaker', 'feeRateMaker']),
      product: this.product.name,
      timestamp,
      signature,
    }
  }

  async place(account) {
    const signedOrder = await this.sign(account)
    return this.client.order.place(signedOrder)
  }
}

module.exports = Order;
