const { TransactionStatus, Wallet, XrpClient, XrplNetwork} = require("xpring-js")

// The expected address of the gRPC server.
// Some options:
//     dev.xrp.xpring.io:50051
//     test.xrp.xpring.io:50051
//     main.xrp.xpring.io:50051
const grpcUrl = "test.xrp.xpring.io:50051";
const wallet = Wallet.generateWalletFromSeed(
  "snYP7oArxKepd3GPDcrjMsJYiJeJB"
);
const recipientAddress =
  "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
const dropsToSend = "10";

async function main() {
  // Instantiate an XrpClient connected to the XRP Ledger Testnet
  console.log("\nUsing rippled node located at: " + grpcUrl + "\n");
  const xrpClient = new XrpClient(grpcUrl, XrplNetwork.Test);

  // Get account balance
  console.log("Retrieving balance for " + wallet.getAddress() + "..");
  const balance = await xrpClient.getBalance(wallet.getAddress());
  console.log("Balance was " + balance + " drops!\n");

  // Send XRP
  console.log("Sending:");
  console.log("- Drops "+ dropsToSend)
  console.log("- To: " + recipientAddress);
  console.log("- From: " + wallet.getAddress() + "\n");
  const transactionResult = await xrpClient.sendXrp(
    dropsToSend,
    recipientAddress,
    wallet
  )

  // Check status of the payment
  console.log("Hash for transaction:\n" + transactionResult.hash + "\n");
  console.log("Result for transaction is:\n" + statusCodeToString(transactionResult.status) + "\n");

  // Retrieve full payment history for account
  console.log("Payment history for account " + wallet.getAddress() + ": ");
  const paymentHistory = await xrpClient.paymentHistory(wallet.getAddress());
  const shortPaymentHistory = paymentHistory.slice(0, Math.min(paymentHistory.length, 5))
  for (const transaction of shortPaymentHistory) {
    console.log(transaction);
  }
}

function statusCodeToString(status) {
  switch (status) {
    case TransactionStatus.Succeeded:
      return "SUCCEEDED"
    case TransactionStatus.Failed:
      return "FAILED"
    case TransactionStatus.ClaimedCostOnly_PathPartial:
      return "CLAIMED_COST_ONLY_PATH_PARTIAL"
    case TransactionStatus.ClaimedCostOnly_PathDry:
      return "CLAIMED_COST_ONLY_PATH_DRY"
    case TransactionStatus.ClaimedCostOnly:
      return "CLAIMED_COST_ONLY"
    case TransactionStatus.MalformedTransaction:
      return "MALFORMED_TRANSACTION"
    case TransactionStatus.LastLedgerSequenceExpired:
      return "LAST_LEDGER_SEQUENCE_EXPIRED"
    case TransactionStatus.Pending:
      return "PENDING"
    case TransactionStatus.Unknown:
    default:
      return "UNKNOWN"
  }
}

// Exit with an error code if there is an error. 
process.on('unhandledRejection', error => {
  console.log(`Fatal: ${error}`)
  process.exit(1)
});

main()