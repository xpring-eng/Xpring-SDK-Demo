import Foundation
import XpringKit

// A URL to reach the remote rippled node at.
let grpcAddress = "3.14.64.116:50051"

// A wallet that exists on Testnet.
let seed = "snYP7oArxKepd3GPDcrjMsJYiJeJB";
guard let wallet = Wallet(seed: seed) else {
  print("The given seed is not valid: \(seed)")
  exit(0)
}

// A recipient address.
let recipientAddress = "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4"
let dropsToSend: UInt64 = 10

print("\nUsing rippled node located at: \(grpcAddress)\n")
let xrpClient = XpringClient(grpcURL: grpcAddress, useNewProtocolBuffers: true)

print("Retrieving balance for \(wallet.address) ..")
let balance = try xrpClient.getBalance(for: wallet.address)

print("Balance was \(balance) drops!\n")

print("Sending:")
print("- Drops \(dropsToSend)")
print("- To: \(recipientAddress)")
print("- From: \(wallet.address)\n")
let hash = try xrpClient.send(dropsToSend, to: recipientAddress, from: wallet)

print("Hash for transaction:\n\(hash)")

let status = try xrpClient.getTransactionStatus(for: hash)
print("Result for transaction is:\n\(status)\n");
