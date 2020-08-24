import Foundation
import XpringKit

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// A client to resolve PayIDs on any network..
let payIDClient = PayIDClient()

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
