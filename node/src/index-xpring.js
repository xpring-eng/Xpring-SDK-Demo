const { 
    XrpPayIdClient, 
    TransactionStatus, 
    Wallet, 
    XrpClient, 
    XrplNetwork, 
    XpringClient 
} = require("xpring-js");

// The expected address of the gRPC server.
const grpcUrl = "test.xrp.xpring.io:50051";

// A wallet with funds on testnet.
const wallet = Wallet.generateWalletFromSeed(
  "snYP7oArxKepd3GPDcrjMsJYiJeJB",
  true
);

// The number of drops to send.
const dropsToSend = "10";

// The PayID to resolve.
const payId = 'alice$dev.payid.xpring.money'

// The network to resolve on. 
const network = XrplNetwork.Test

async function main() {
    console.log("\nUsing rippled node located at: " + grpcUrl + "\n");
    const xrpClient = new XrpClient(grpcUrl, network);

    console.log("Using network: " + networkToString(network) + "\n");
    const payIdClient = new XrpPayIdClient(network);

    const xpringClient = new XpringClient(payIdClient, xrpClient);

    console.log("Sending:");
    console.log("- Drops "+ dropsToSend)
    console.log("- To: " + payId);
    console.log("- From: " + wallet.getAddress() + "\n");
    const hash = await xpringClient.send(dropsToSend, payId, wallet)

    console.log("Hash for transaction:\n" + hash + "\n");
  
    const status = await xrpClient.getPaymentStatus(hash);

    console.log("Result for transaction is:\n" + statusCodeToString(status) + "\n");
}

function networkToString(network) {
    switch (network) {
        case XrplNetwork.Dev:
            return "Devnet"
        case XrplNetwork.Test:
            return "Testnet"
        case XrplNetwork.Main:
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
