const { PayIdClient, XrpPayIdClient, XrplNetwork } = require("xpring-js");

// The PayID to resolve.
const payId = "alice$dev.payid.xpring.money";

// A client to resolve PayIDs on any network.
const payIdClient = new PayIdClient();

async function main() {
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