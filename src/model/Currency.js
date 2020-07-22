const CRCL = require('../abi/CRCL.json');
const ERC777 = require('../abi/ERC777.json');

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

  get Contract () {
    return this.client.cfx.Contract({
      address: this.contractAddress,
      abi: CRCL.abi
    });
  }

  get TokenContract () {
    return this.client.cfx.Contract({
      address: this.tokenAddress,
      abi: ERC777.abi
    });
  }
}

module.exports = Currency;