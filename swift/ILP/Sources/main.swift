import Foundation
import XpringKit

let grpcUrl = "hermes-grpc.ilpv4.dev"
let demoUserId = "demo_user"
let demoUserAuthToken = "2S1PZh3fEKnKg"

print("\nUsing Hermes node located at: \(grpcUrl) \n")
let ilpClient = IlpClient(grpcURL: grpcUrl)


print("Retrieving balance for \(demoUserId)...")
let getBalance = try ilpClient.getBalance(for: demoUserId, withAuthorization: demoUserAuthToken)
print("Net balance was \(getBalance.netBalance) with asset scale \(getBalance.assetScale)")

let receiverPaymentPointer = "$money.ilpv4.dev/demo_receiver"
let amountToSend: UInt64 = 100
print("\nSending payment:")
print("- From: \(demoUserId)")
print("- To: \(receiverPaymentPointer)")
print("- Amount: \(amountToSend) drops")
let payment = try ilpClient.sendPayment(amountToSend,
                                        to: receiverPaymentPointer,
                                        from: demoUserId,
                                        withAuthorization: demoUserAuthToken)

print("\nPayment sent!")
print("Amount sent: \(payment.amountSent)")
print("Amount delivered: \(payment.amountDelivered)")
print("Payment was \((payment.successfulPayment ? "successful!" : "unsuccessful!"))")

let balanceAfterPayment = try ilpClient.getBalance(for: demoUserId, withAuthorization: demoUserAuthToken);
print("Net balance after sending payment was \(balanceAfterPayment.netBalance)")
