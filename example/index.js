const { Conflux, Account } = require('js-conflux-sdk')
const MatchFlowClient = require('matchflow')

const privateKey = '0x1f3e016e5c274425f968b5dc99ef04395f159ece3b727f701af56a7a324b4306'
const account = new Account(privateKey)
const matchflow = new MatchFlowClient({ network: 'testnet' })

const cfx = new Conflux({
  url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
  defaultGasPrice: 100,
  defaultGas: 1000000,
  //logger: console
})

async function main() {
  // Load the product list
  // await matchflow.product.list().then(console.log)

  // Load a specific product
  // const product = await matchflow.product.get('BTC-USDT')

  // Get product last trade
  // const lastTrade = await product.lastTrade()
  // const closingPrice = await product.closingPrice()
  // console.log('Last Trade:', lastTrade)
  // console.log('Closing Price:', closingPrice)

  await deposit('USDT', 1000, account, account.address)
  // await withdraw('USDT', 1000, account, account.address)

  // await createLimitBuyOrder(account, 'BTC-USDT', { price: 100, amount: 1000 })

  // await cancelOrder(account, 0)
}

async function deposit(currencyName, amount, account, recipient) {
  const currency = await matchflow.currency.get(currencyName)

  // fetch current balance
  let balance = await currency.Contract(cfx).balanceOf(recipient)
  console.log('Balance before deposit:', balance.toString())
  let recipientBalance = await currency.TokenContract(cfx).balanceOf(account.address)
  console.log('Recipient balance before deposit:', recipientBalance.toString())
    
  await currency.deposit(account, recipient, amount, cfx)
}

async function withdraw(currencyName, amount, account, recipient) {
  // Load the currency list
  // await matchflow.currency.list().then(console.log)

  // Load a specific currency
  const currency = await matchflow.currency.get(currencyName)

  // fetch current balance
  let balance = await currency.Contract(cfx).balanceOf(account.address)
  console.log('Balance before withdraw:', balance.toString())
  let recipientBalance = await currency.TokenContract(cfx).balanceOf(recipient)
  console.log('Recipient balance before withdraw:', recipientBalance.toString())

  await currency.withdraw(account, recipient, amount)
}

async function createLimitBuyOrder(account, productName, { price, amount }) {
  // Load a specific product
  const product = await matchflow.product.get(productName)

  // Get a user
  const user = await matchflow.user.get(account.address)

  // Get user accounts
  // await user.accounts().then(console.log)

  // Create a buy order
  const buyOrder = user.limitBuy(product, { price, amount })

  // Place the order. Will sign using the account private key.
  await buyOrder.place(account)
}

async function cancelOrder(account, cancelOrderIndex = 0) {
  const user = await matchflow.user.get(account.address)

  // Get user orders
  const orders = await user.openOrders()
  console.log(orders)
  
  // Cancel the order
  // await orders[cancelOrderIndex].cancel(account)
}

main()
