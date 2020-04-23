const open = require('open')
const {
  TransactionStatus,
  Wallet,
  PayIDClient,
  XRPClient,
} = require('xpring-js')

// The expected address of the gRPC server.
// const grpcURL = "test.xrp.xpring.io:50051";
const grpcURL = 'main.xrp.xpring.io:50051'
const wallet = Wallet.generateWalletFromSeed('INSERT SEED')

// Get the recipient address via PayID

// The Pay ID to resolve.
const payID = 'GiveDirectly$payid.charity'

// A client for PayID
const payIDClient = new PayIDClient('xrpl-mainnet')

// Amount to send in Drops
const dropsToSend = '10'

async function main() {
  console.log(`\nUsing rippled node located at: ${grpcURL}\n`)
  const xrpClient = new XRPClient(grpcURL)

  // Fetch ledger address from PayID
  console.log(`Fetching ledger address for PayID ${payID}`)
  const recipientAddress = await payIDClient.addressForPayID(
    'GiveDirectly$payid.charity',
  )
  console.log(`Recipient address is ${recipientAddress}\n`)

  // Get Balance and TX information
  console.log(`Retrieving balance for ${wallet.getAddress()}..`)
  const balance = await xrpClient.getBalance(wallet.getAddress())
  console.log(`Balance was ${balance} drops!\n`)
  console.log('Sending:')
  console.log(`- Drops ${dropsToSend}`)
  console.log(`- To: ${recipientAddress}`)
  console.log(`- From: ${wallet.getAddress()}\n`)

  // Send on Ledger
  const hash = await xrpClient.send(dropsToSend, recipientAddress, wallet)

  console.log(`Hash for transaction:\n${hash}\n`)

  const status = await xrpClient.getPaymentStatus(hash)

  console.log(`Result for transaction is:\n${statusCodeToString(status)}\n`)
  open(`https://livenet.xrpl.org/transactions/${hash}`)
}

function statusCodeToString(status) {
  switch (status) {
    case TransactionStatus.Succeeded:
      return 'SUCCEEDED'
    case TransactionStatus.Failed:
      return 'FAILED'
    case TransactionStatus.Pending:
      return 'PENDING'
    case TransactionStatus.Unknown:
    default:
      return 'UNKNOWN'
  }
}

main()
