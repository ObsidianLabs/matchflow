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
}

module.exports = Currency;