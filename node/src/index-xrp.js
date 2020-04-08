const { TransactionStatus, Wallet, XRPClient } = require("xpring-js")

// The expected address of the gRPC server.
// Some options:
//     dev.xrp.xpring.io:50051
//     test.xrp.xpring.io:50051
//     main.xrp.xpring.io:50051
const grpcURL = "test.xrp.xpring.io:50051";
const wallet = Wallet.generateWalletFromSeed(
  "snYP7oArxKepd3GPDcrjMsJYiJeJB"
);
const recipientAddress =
  "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
const dropsToSend = "10";

async function main() {
  // Instantiate an XRPClient connected to the XRP Ledger Testnet
  console.log("\nUsing rippled node located at: " + grpcURL + "\n");
  const xrpClient = new XRPClient(grpcURL);

  // Get account balance
  console.log("Retrieving balance for " + wallet.getAddress() + "..");
  const balance = await xrpClient.getBalance(wallet.getAddress());
  console.log("Balance was " + balance + " drops!\n");

  // Send XRP
  console.log("Sending:");
  console.log("- Drops "+ dropsToSend)
  console.log("- To: " + recipientAddress);
  console.log("- From: " + wallet.getAddress() + "\n");
  const hash = await xrpClient.send(
    dropsToSend,
    recipientAddress,
    wallet
  )

  // Check status of the payment
  console.log("Hash for transaction:\n" + hash + "\n");
  const status = await xrpClient.getPaymentStatus(hash);
  console.log("Result for transaction is:\n" + statusCodeToString(status) + "\n");

  // Retrieve full payment history for account
  console.log("Payment history for account " + wallet.getAddress() + ": ");
  const paymentHistory = await xrpClient.paymentHistory(wallet.getAddress());
  for (const transaction of paymentHistory) {
    console.log(transaction);
  }
}

function statusCodeToString(status) {
  switch (status) {
    case TransactionStatus.Succeeded:
      return "SUCCEEDED"
    case TransactionStatus.Failed:
      return "FAILED"
    case TransactionStatus.Pending:
      return "PENDING"
    case TransactionStatus.Unknown:
    default:
      return "UNKNOWN"
  }
}

main()
