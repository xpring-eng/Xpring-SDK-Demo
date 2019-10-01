import Foundation
import XpringKit

// An address on TestNet that has a balance.
let testNetAddress = "rD7zai6QQQVvWc39ZVAhagDgtH5xwEoeXD"

// The expected address of the gRPC server.
let grpcURL = "grpc.xpring.tech:80"
let wallet = Wallet(seed: "snYP7oArxKepd3GPDcrjMsJYiJeJB")!

// An address to receive XRP.
let recipientAddress = "rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn"

// An amount of XRP to send.
let amount = Io_Xpring_XRPAmount.with { $0.drops = "1" }

// A client for the XRP Ledger.
let xrpClient = XpringClient(grpcURL: grpcURL)

// Get the balance of an account.
print("Retrieving balance for " + testNetAddress)
let balance = try! xrpClient.getBalance(for: testNetAddress)
print("Balance was: " + balance.drops)

print("Sending " + amount.drops + " drop of XRP to " + recipientAddress + " from " + wallet.address)
let result = try! xrpClient.send(amount, to: recipientAddress, from: wallet)
print("Sent with result: \(result.engineResultMessage)")
