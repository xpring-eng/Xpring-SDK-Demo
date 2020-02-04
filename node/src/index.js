const { TransactionStatus, Wallet, XpringClient } = require("xpring-js")

// The expected address of the gRPC server.
const grpcURL = "3.14.64.116:50051";
const wallet = Wallet.generateWalletFromSeed(
  "snYP7oArxKepd3GPDcrjMsJYiJeJB"
);
const recipientAddress =
  "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
const dropsToSend = "10";

async function main() {
  console.log("\nUsing rippled node located at: " + grpcURL + "\n");
  const xpringClient = new XpringClient(grpcURL, true);

  console.log("Retrieving balance for " + wallet.getAddress() + "..");
  const balance = await xpringClient.getBalance(wallet.getAddress());
  console.log("Balance was " + balance + " drops!\n");

  console.log("Sending:");
  console.log("- Drops: "+ dropsToSend)
  console.log("- To: " + recipientAddress);
  console.log("- From: " + wallet.getAddress());
  const hash = await xpringClient.send(
    dropsToSend,
    recipientAddress,
    wallet
  )
  console.log("Hash for transaction:\n" + hash + "\n");

  const transactionStatus = await xpringClient.getTransactionStatus(hash);
  console.log("Status of transaction is:\n")
  console.log(transcationStatusToString(transactionStatus) + "\n");
}

function transcationStatusToString(transactionStatus) {
  switch (transactionStatus) {
    case TransactionStatus.Pending:
      return "Pending"
    case TransactionStatus.Failed:
      return "Failed"
    case TransactionStatus.Succeeded:
      return "Succeeded"
    default:
      return "Unknown'"
  }
}

main()
