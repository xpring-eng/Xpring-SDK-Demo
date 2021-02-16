import Foundation
import XpringKit

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// The XRP Ledger network to resolve on.
let xrplNetwork = XRPLNetwork.main

// A client which can resolve PayIDs on the XRP ledger network.
let xrpPayIDClient = XRPPayIDClient(xrplNetwork: .main)

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