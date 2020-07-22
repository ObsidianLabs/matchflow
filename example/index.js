const { Conflux } = require('js-conflux-sdk')
const MatchFlowClient = require('matchflow')

const cfx = new Conflux({
  url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
  defaultGas: 1000000,
  //logger: console
})

const privateKey = '0x1f3e016e5c274425f968b5dc99ef04395f159ece3b727f701af56a7a324b4306'
const account = cfx.Account(privateKey)

async function main() {
  const matchflow = new MatchFlowClient({ cfx, network: 'testnet' })

  // Load currency list
  // await matchflow.currency.list().then(console.log)

  // Load a specific currency
  // await matchflow.currency.get(1).then(console.log)
  // await matchflow.currency.get('USDT').then(console.log)

  // Load product list
  // await matchflow.product.list().then(console.log)

  // Load a specific product
  const product = await matchflow.product.get('BTC-USDT')

  // Get product last trade
  // const lastTrade = await product.lastTrade()
  // const closingPrice = await product.closingPrice()
  // console.log('Last Trade:', lastTrade)
  // console.log('Closing Price:', closingPrice)

  // Get a user
  const user = await matchflow.user.get(account.address)

  // Get user accounts
  // await user.accounts().then(console.log)

  // Create a buy order
  const buyOrder = user.limitBuy(product, { price: 100, amount: 1000 })

  // Place the order. Will sign using the account private key.
  const result = await buyOrder.place(account)
  console.log(result)

  // const orders = await user.orders()
  // console.log(orders)
}

main()
