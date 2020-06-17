import Foundation
import XpringKit

// The Pay ID to resolve.
let payID = "alice$dev.payid.xpring.money"

// The XRP Ledger network to resolve on.
let xrplNetwork = XRPLNetwork.main

// A client which can resolve PayIDs on the XRP ledger network.
let xrpPayIDClient = XRPPayIDClient(xrplNetwork: .main)

// The bitcoin network to resolve on.
let btcNetwork = "btc-testnet"

// A client which can resolve PayIDs on the XRP ledger network.
let payIDClient = PayIDClient(network: btcNetwork)


// Run items on a background thread because PayID client always calls back on the main thread and there is no
// synchronous API.
// TODO(keefertaylor): Clean this up when XpringKit supports thread management or synchronous APIs in PayID.
let dispatchGroup = DispatchGroup()

DispatchQueue.global(qos: .background).async {
  dispatchGroup.enter()

  print("Resolving PayID: \(payID)")
  print("On XRP Network: \(xrplNetwork)")
  xrpPayIDClient.xrpAddress(for:  "alice$dev.payid.xpring.money") { result in
    switch result {
    case .success(let xrpAddress):
      print("Resolved to \(xrpAddress)")
      print("")
    case .failure(let error):
      fatalError("Unknown error resolving address: \(error)")
    }
    dispatchGroup.leave()
  }
  dispatchGroup.wait()


  // Resolve a PayID to a BTC Address.
  print("Resolving Pay ID: \(payID)")
  print("On network: \(btcNetwork)")
  dispatchGroup.enter()

  payIDClient.address(for: payID) { result in
    switch result {
    case .success(let btcAddressComponents):
      print("Resolved to \(btcAddressComponents.address)")
      print("")
    case .failure(let error):
      fatalError("Unknown error resolving address: \(error)")
    }
    dispatchGroup.leave()

  }
  dispatchGroup.wait()

  // Kill process with success code now that all work is done.
  exit(EXIT_SUCCESS)
}

// Let async work run.
dispatchMain()
