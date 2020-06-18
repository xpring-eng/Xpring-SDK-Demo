import Foundation
import XpringKit

// The expected address of the gRPC server.
let grpcURL = "test.xrp.xpring.io:50051"

// A wallet with funds on testnet.
let seed = "snYP7oArxKepd3GPDcrjMsJYiJeJB"
let wallet = Wallet(seed: seed)!

// The number of drops to send.
let dropsToSend: UInt64 = 10

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// The network to resolve on.
let network = XRPLNetwork.test


// Run items on a background thread because `XpringClient` always calls back on the main thread and there is no
// synchronous API.
// TODO(keefertaylor): Clean this up when XpringKit supports thread management or synchronous APIs in XpringClient.
let dispatchGroup = DispatchGroup()

DispatchQueue.global(qos: .background).async {

  print("\nUsing rippled node located at: \(grpcURL)\n")
  let xrpClient = XRPClient(grpcURL: grpcURL, network: network)

  print("Using network: \(network)\n")
  let payIDClient = XRPPayIDClient(xrplNetwork: network)

  let xpringClient = try! XpringClient(payIDClient: payIDClient, xrpClient: xrpClient)

  print("Sending:");
  print("- Drops \(dropsToSend)")
  print("- To: \(payID)")
  print("- From: \(wallet.address)\n")

  dispatchGroup.enter()
  xpringClient.send(dropsToSend, to: payID, from: wallet) { result in
    switch result {
    case .success(let hash):
      print("Hash for transaction:\n\(hash)\n")
      let status = try! xrpClient.paymentStatus(for: hash)
      print("Result for transaction is:\n\(status)\n")
    case .failure:
      fatalError("Unable to send transaction.")
    }
    dispatchGroup.leave()
  }
  dispatchGroup.wait()
  // Kill process with success code now that all work is done.
  exit(EXIT_SUCCESS)
}

// Let async work run.
dispatchMain()
