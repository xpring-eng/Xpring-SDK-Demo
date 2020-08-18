const { PayIdClient, XrpPayIdClient, XrplNetwork } = require("xpring-js");

// The PayID to resolve.
const payId = "alice$dev.payid.xpring.money";

// The XRP network to resolve on.
const xrpNetwork = XrplNetwork.Main;

// The BTC network to resolve on.
const btcNetwork = "btc-testnet";

// A client to resolve PayIDs on the XRP Ledger.
const xrpPayIdClient = new XrpPayIdClient(xrpNetwork);

// A client to resolve PayIDs on the Bitcoin testnet.
const payIdClient = new PayIdClient();

async function main() {
  console.log("Resolving PayID: " + payId);
  console.log("On network: " + btcNetwork);
  const btcAddressComponents = await payIdClient.cryptoAddressForPayId(
    payId,
    btcNetwork
  );
  console.log("Resolved to " + btcAddressComponents.address);
  console.log("");

  console.log("Resolving PayID: " + payId);
  console.log("On network: " + networkToString(xrpNetwork));
  const xrpAddress = await xrpPayIdClient.xrpAddressForPayId(payId);
  console.log("Resolved to " + xrpAddress);
  console.log("");

  console.log("Resolving All PayIDs for: " + payId);
  const allAddresses = await payIdClient.allAddressesForPayId(payId);
  console.log("Resolved to:");
  for (let i = 0; i < allAddresses.length; i++) {
    console.log(`${i}) ${JSON.stringify(allAddresses[i])}`);
  }
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
