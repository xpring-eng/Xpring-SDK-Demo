const axios = require('axios')
const EthereumTx = require('ethereumjs-tx').Transaction
const open = require('open')
const Web3 = require('web3')
const { PayIDClient } = require('xpring-js')

/**
 * The address you are sending from
 * @type {String}
 */
const fromAddress = 'ADD YOUR ADDRESS HERE' // 0xD0544A81F0962F7ff0d08Eaf1E5B226DAD331316

/**
 * The private key of the account you are sending from
 * @type {String}
 */
const privateKey = 'PRIVATE KEY GOES HERE' //  INSERT YOUR PRIVATE KEY HERE

/**
 * Network configuration
 */
const network = 'https://mainnet.infura.io/v3/2ba7c66b29f44b66aa7916d33a67ffe6'
const web3 = new Web3(new Web3.providers.HttpProvider(network))

/**
 * Set the web3 default account to use as your public wallet address
 */
web3.eth.defaultAccount = fromAddress

/**
 * The amount of Wei you want to send in this transaction
 * @type {String}
 */
const amountToSend = '1'

/**
 * Fetch the current transaction gas prices from https://ethgasstation.info/
 *
 * @return {Promise<object>} Gas prices at different priorities
 */
const getCurrentGasPrices = async () => {
  const response = await axios.get(
    'https://ethgasstation.info/json/ethgasAPI.json',
  )
  const prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  }

  console.log('Current ETH Gas Prices (in GWEI):')
  console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`)
  console.log(
    `Standard: ${prices.medium} (transaction completes in < 5 minutes)`,
  )
  console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)\n`)

  return prices
}

/**
 * This is the process that will run when you execute the program.
 */
const main = async () => {
  console.log('\nLooking up the Eth address for GiveDirectly$payid.charity')

  /**
   * Fetch the Eth address of GiveDirectly PayID
   */
  const payIDClient = new PayIDClient('eth-mainnet')
  const toAddress = await payIDClient.addressForPayID(
    'GiveDirectly$payid.charity',
  )

  console.log(`Address is ${toAddress}\n`)

  /**
   * Fetch your personal wallet's balance
   */
  const myBalanceWei = await web3.eth.getBalance(web3.eth.defaultAccount)
  console.log(`My wallet balance is currently ${myBalanceWei} Wei\n`)

  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
  console.log(
    `The outgoing transaction count for your wallet address is: ${nonce}\n`,
  )

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  const gasPrices = await getCurrentGasPrices()

  /**
   * Build a new transaction object and sign it locally.
   */
  const details = {
    to: toAddress,
    value: web3.utils.toHex(amountToSend),
    gas: 42000,
    gasPrice: gasPrices.high * 1000000000, // converts the gwei price to wei
    nonce,
    chainId: 1, // EIP 155 chainId - mainnet: 1, rinkeby: 4
  }

  const transaction = new EthereumTx(details)

  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(privateKey, 'hex'))

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize()

  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  console.log('Sending ETH Transaction')
  await web3.eth
    .sendSignedTransaction(`0x${serializedTransaction.toString('hex')}`)
    .once('transactionHash', (hash) => {
      /**
       * We now know the transaction ID, so let's build the public Etherscan url where
       * the transaction details can be viewed.
       */
      console.log(`https://etherscan.io/tx/${hash}`)

      console.log(
        'Note: please allow for 30 seconds before transaction appears on Etherscan\n',
      )
      open(`https://etherscan.io/tx/${hash}`)
      process.exit()
    })
}

main()
