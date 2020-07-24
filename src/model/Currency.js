const BN = require('bignumber.js')
const sigUtil = require('cfx-sig-util')
const CRCL = require('../abi/CRCL.json');
const ERC777 = require('../abi/ERC777.json');

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]
const withdrawRequest = [
  { name: 'userAddress', type: 'address' },
  { name: 'amount', type: 'uint256' },
  { name: 'recipient', type: 'address' },
  { name: 'isCrosschain', type: 'bool' },
  { name: 'nonce', type: 'uint256' },
]

class Currency {
  constructor ({
    id,
    name,
    contractAddress,
    tokenAddress,
    decimalDigits,
    crossChain,
    minimumWithdrawAmount
  }, client) {
    this.id = id;
    this.name = name;
    this.contractAddress = contractAddress;
    this.tokenAddress = tokenAddress;
    this.decimalDigits = decimalDigits;
    this.crossChain = crossChain;
    this.minimumWithdrawAmount = minimumWithdrawAmount;
    this.client = client;
  }

  Contract(cfx) {
    return cfx.Contract({
      address: this.contractAddress,
      abi: CRCL.abi
    });
  }

  TokenContract(cfx) {
    return cfx.Contract({
      address: this.tokenAddress,
      abi: ERC777.abi
    });
  }

  async deposit (account, recipient, amount, cfx) {
    await this.TokenContract(cfx)
      .send(
        this.contractAddress,
        BN(amount).times(BN(1e18)).toFixed(),
        Buffer.from(recipient.toString().slice(2), 'hex')
      )
      .sendTransaction({ from: account })
      .executed()
  }

  async withdraw (account, recipient, amount) {
    const timestamp = new Date().getTime()
    const data = {
      types: {
        EIP712Domain,
        WithdrawRequest: withdrawRequest
      },
      primaryType: 'WithdrawRequest',
      domain: {
        name: 'CRCL',
        version: '1.0',
        chainId: 2,
        verifyingContract: this.contractAddress
      },
      message: {
        userAddress: account.address,
        amount: BN(amount).times(BN(1e18)).toFixed(),
        recipient,
        isCrosschain: false,
        nonce: timestamp
      }
    }
    const signature = sigUtil.signTypedData_v4(Buffer.from(account.privateKey.slice(2), 'hex'), { data })
    
    const body = {
      userAddress: account.address,
      currency: this.name,
      amount,
      recipient,
      crossChain: false,
      timestamp,
      signature,
    }
    return this.client.account.withdraw(body)
  }
}

module.exports = Currency;