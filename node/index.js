const { Wallet, XRPAmount, XpringClient } = require("xpring-js")

// An address on TestNet that has a balance.
const testNetAddress = "rD7zai6QQQVvWc39ZVAhagDgtH5xwEoeXD";

// The expected address of the gRPC server.
const grpcURL = "grpc.xpring.tech:80";
console.log("Hitting " + grpcURL);
const wallet = Wallet.generateWalletFromSeed("snYP7oArxKepd3GPDcrjMsJYiJeJB");

const recipientAddress = "rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn";

async function main() {
  const amount = new XRPAmount();
  amount.setDrops("1");

  const xrpClient = XpringClient.xpringClientWithEndpoint(grpcURL);

  console.log("Retrieving balance for " + testNetAddress);
  const balance = await xrpClient.getBalance(testNetAddress);

  console.log("Sending " + amount.getDrops() + " drop of XRP to " + recipientAddress + " from " + wallet.getAddress())
  const result = await xrpClient.send(wallet, amount, recipientAddress)

  console.log("Sent with result: " + result.getEngineResultMessage())
}

main()
