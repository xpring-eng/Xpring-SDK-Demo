const { TransactionStatus, Wallet, XpringClient } = require("xpring-js")

// The expected address of the gRPC server.
const grpcURL = "3.17.152.92:50051";
// const wallet = Wallet.generateWalletFromSeed(
//   "snYP7oArxKepd3GPDcrjMsJYiJeJB"
// );
// const recipientAddress =
//   "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
// const dropsToSend = "10";

async function main() {
  console.log("\nUsing rippled node located at: " + grpcURL + "\n");
  const xrpClient = new XpringClient(grpcURL, true);

  console.log("Retrieving balance for " + "XVYUQ3SdUcVnaTNVanDYo1NamrUukPUPeoGMnmvkEExbtrj" + "..");
  const balance = await xrpClient.getBalance("XVYUQ3SdUcVnaTNVanDYo1NamrUukPUPeoGMnmvkEExbtrj");
  console.log("Balance was " + balance + " drops!\n");
  //
  // console.log("Sending:");
  // console.log("- Drops "+ dropsToSend)
  // console.log("- To: " + recipientAddress);
  // console.log("- From: " + wallet.getAddress() + "\n");
  // const hash = await xrpClient.send(
  //   dropsToSend,
  //   recipientAddress,
  //   wallet
  // )
  //
  // console.log("Hash for transaction:\n" + hash + "\n");
  //
  // const status = await xrpClient.getTransactionStatus(hash);
  //   // status.toString()
  //
  // console.log("Result for transaction is:\n" + statusCodeToString(status) + "\n");
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
