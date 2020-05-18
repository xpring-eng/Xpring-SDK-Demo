const { XRPPayIDClient, XRPLNetwork } = require("xpring-js")

// The Pay ID to resolve.
const payID = 'alice$dev.payid.xpring.money'

// The network to resolve on. 
const network = XRPLNetwork.Main

// A client for PayID
const payIDClient = new XRPPayIDClient(network);

async function main() {
    console.log("Resolving Pay ID: " + payID);
    console.log("On network: " + networkToString(network))

    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)
    console.log("Resolved to " + xrpAddress)
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

// Exit with an error code if there is an error. 
process.on('unhandledRejection', error => {
    console.log(`Fatal: ${error}`)
    process.exit(1)
  });
    

main()
