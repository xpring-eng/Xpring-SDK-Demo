const { PayIDClient, XRPPayIDClient, XRPLNetwork } = require("xpring-js")

// The Pay ID to resolve.
const payId = 'alice$dev.payid.xpring.money'

// The XRP network to resolve on. 
const xrpNetwork = XRPLNetwork.Main

// The BTC network to resolve on.
const btcNetwork = 'btc-testnet'

// A client to resolve PayIDs on the XRP Ledger.
const xrpPayIdClient = new XRPPayIDClient(xrpNetwork);

// A client to resolve PayIDs on the Bitcoin testnet.
const btcPayIdClient = new PayIDClient(btcNetwork)

async function main() {
    console.log("Resolving PayID: " + payId);
    console.log("On network: " + networkToString(xrpNetwork))

    const xrpAddress = await xrpPayIdClient.xrpAddressForPayID(payId)
    console.log("Resolved to " + xrpAddress)
    console.log("")

    console.log("Resolving PayID: " + payId);
    console.log("On network: " + btcNetwork)
    const btcAddressComponents = await btcPayIdClient.addressForPayID(payId)
    console.log("Resolved to " + btcAddressComponents.address)
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
