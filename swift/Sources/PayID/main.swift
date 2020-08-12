import Foundation
import XpringKit

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// The XRP Ledger network to resolve on.
let xrplNetwork = XRPLNetwork.main

// A client which can resolve PayIDs on the XRP ledger network.
let xrpPayIDClient = XRPPayIDClient(xrplNetwork: .main)

// Resolve on Bitcoin testnet.
let btcNetwork = "btc-testnet"

// A client which can resolve PayIDs on the XRP ledger network.
let payIDClient = PayIDClient()

// Resolve a PayID to a BTC Address using a `PayIDClient`.
print("Resolving PayID: \(payID)")
print("On network: \(btcNetwork)")

let btcResult = payIDClient.cryptoAddress(for: payID, on: btcNetwork)
switch btcResult {
case .success(let btcAddressComponents):
  print("Resolved to \(btcAddressComponents.address)")
  print("")
case .failure(let error):
  fatalError("Unknown error resolving address: \(error)")
}

// Resolve PayID to an XRP Address, using `XRPPayIDClient`.
print("Resolving PayID: \(payID)")
print("On XRP Network: \(xrplNetwork)")

let xrpResult = xrpPayIDClient.xrpAddress(for: "alice$dev.payid.xpring.money")
switch xrpResult {
case .success(let xrpAddress):
  print("Resolved to \(xrpAddress)")
  print("")
case .failure(let error):
  fatalError("Unknown error resolving address: \(error)")
}

// Resolve all addresses
print("Resolving All PayIDs for: \(payID)");
guard case let .success(allAddresses) = payIDClient.allAddresses(for: payID) else {
  fatalError("Could not resolve all addresses")
}
print("Resolved to:")
for (index, address) in allAddresses.enumerated() {
  print("\(index)) PaymentNetwork: \(address.paymentNetwork), Environment: \(String(describing: address.environment)), Address: \(address.addressDetails.address), Tag: \(String(describing: address.addressDetails.tag))")
}
print("")
