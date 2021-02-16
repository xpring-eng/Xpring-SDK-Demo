import Foundation
import XpringKit

// The PayID to resolve.
let payID = "alice$dev.payid.xpring.money"

// Resolve on Bitcoin testnet.
let btcNetwork = "btc-testnet"

 // A client to resolve PayIDs on any network.
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