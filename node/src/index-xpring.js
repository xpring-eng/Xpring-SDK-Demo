const { 
    XRPPayIDClient, 
    TransactionStatus, 
    Wallet, 
    XRPClient, 
    XRPLNetwork, 
    XpringClient 
} = require("xpring-js");

// The expected address of the gRPC server.
const grpcURL = "test.xrp.xpring.io:50051";

// A wallet with funds on testnet.
const wallet = Wallet.generateWalletFromSeed(
  "snYP7oArxKepd3GPDcrjMsJYiJeJB",
  true
);

// The number of drops to send.
const dropsToSend = "10";

// The Pay ID to resolve.
const payID = 'alice$dev.payid.xpring.money'

// The network to resolve on. 
const network = XRPLNetwork.Test

async function main() {
    console.log("\nUsing rippled node located at: " + grpcURL + "\n");
    const xrpClient = new XRPClient(grpcURL, network);

    console.log("Using network: " + networkToString(network) + "\n");
    const payIDClient = new XRPPayIDClient(network);

    const xpringClient = new XpringClient(payIDClient, xrpClient);

    console.log("Sending:");
    console.log("- Drops "+ dropsToSend)
    console.log("- To: " + payID);
    console.log("- From: " + wallet.getAddress() + "\n");
    const hash = await xpringClient.send(dropsToSend, payID, wallet)

    console.log("Hash for transaction:\n" + hash + "\n");
  
    const status = await xrpClient.getPaymentStatus(hash);

    console.log("Result for transaction is:\n" + statusCodeToString(status) + "\n");
}

function networkToString(network) {
    switch (network) {
        case XRPLNetwork.Dev:
            return "Devnet"
        case XRPLNetwork.Test:
            return "Testnet"
        case XRPLNetwork.Main:
            return "Mainnet"
        default:
            return "Unknown Network"
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

// Exit with an error code if there is an error. 
process.on('unhandledRejection', error => {
  console.log(`Fatal: ${error}`)
  process.exit(1)
});


main()
