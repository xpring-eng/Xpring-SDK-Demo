import XpringKit

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// The XRP Ledger network to resolve on.
let xrplNetwork = XRPLNetwork.main

// A client which can resolve PayIDs on the XRP ledger network.
let xrpPayIDClient = XRPPayIDClient(xrplNetwork: xrplNetwork)

// The bitcoin network to resolve on.
let btcNetwork = "btc-testnet"

// A client which can resolve PayIDs on the XRP ledger network.
let payIDClient = PayIDClient(network: btcNetwork)

// Resolve a PayID to an XRP Address.
print("Resolving Pay ID: \(payID)")
print("On network: \(xrplNetwork)")
xrpPayIDClient.xrpAddress(for: payID) { result in
  switch result {
  case .success(let xrpAddress):
    print("Resolved to \(xrpAddress)")
    print("")
  case .failure:
    fatalError("Unknown error resolving address.")
  }
}

// Resolve a PayID to an BTC Address.
print("Resolving Pay ID: \(payID)")
print("On network: \(btcNetwork)")
payIDClient.address(for: payID) { result in
  switch result {
  case .success(let btcAddressComponents):
    print("Resolved to \(btcAddressComponents.address)")
  case .failure:
    fatalError("Unknown error resolving address.")
  }
}

