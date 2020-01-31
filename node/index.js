const { Wallet, XpringClient } = require("xpring-js")

// The expected address of the gRPC server.
const grpcURL = "3.14.64.116:50051";
const wallet = Wallet.generateWalletFromSeed("snYP7oArxKepd3GPDcrjMsJYiJeJB");
const recipientAddress = "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
const dropsToSend = "10";

async function main() {
  console.log("Using rippled node located at: " + grpcURL);
  const xrpClient = new XpringClient(grpcURL, true);

  console.log("Retrieving balance for " + wallet.getAddress());
  const balance = await xrpClient.getBalance(wallet.getAddress());
  console.log("Balance was " + balance + " drops!");

  console.log("Sending " + dropsToSend + " drops of XRP to " + recipientAddress + " from " + wallet.getAddress())
  const result = await xrpClient.send(dropsToSend, recipientAddress, wallet)

  console.log("Hash for transaction is " + result);
}

main()
