const { PayIdClient, XrpPayIdClient, XrplNetwork } = require("xpring-js");

// The PayID to resolve.
const payId = "alice$dev.payid.xpring.money";

// The XRP network to resolve on.
const xrpNetwork = XrplNetwork.Main;

// A client to resolve PayIDs on the XRP Ledger.
const xrpPayIdClient = new XrpPayIdClient(xrpNetwork);

async function main() {
  console.log("Resolving PayID: " + payId);
  console.log("On network: " + networkToString(xrpNetwork));
  const xrpAddress = await xrpPayIdClient.xrpAddressForPayId(payId);
  console.log("Resolved to " + xrpAddress);
  console.log("");

}

function networkToString(network) {
  switch (network) {
    case XrplNetwork.Dev:
      return "Devnet";
    case XrplNetwork.Test:
      return "Testnet";
    case XrplNetwork.Main:
      return "Mainnet";
    default:
      return "Unknown Network";
  }
}

// Exit with an error code if there is an error.
process.on("unhandledRejection", (error) => {
  console.log(`Fatal: ${error}`);
  process.exit(1);
});

main();