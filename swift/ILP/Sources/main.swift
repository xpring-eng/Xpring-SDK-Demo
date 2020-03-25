import Foundation
import XpringKit

let grpcUrl = "hermes-envoy-test.xpring.io"
let demoUserId = "demo_user"
let demoUserAuthToken = "2S1PZh3fEKnKg"

print("\nUsing Hermes node located at: \(grpcUrl) \n")
let ilpClient = IlpClient(grpcURL: grpcUrl)


print("Retrieving balance for \(demoUserId)...")
let getBalance = try ilpClient.getBalance(for: demoUserId, withAuthorization: demoUserAuthToken)
print("Net balance was \(getBalance.netBalance) with asset scale \(getBalance.assetScale)")

let receiverPaymentPointer = "$xpring.money/demo_receiver"
let amountToSend: UInt64 = 100
print("\nSending payment:")
print("- From: \(demoUserId)")
print("- To: \(receiverPaymentPointer)")
print("- Amount: \(amountToSend) drops")
let paymentRequest = PaymentRequest(amountToSend, to: receiverPaymentPointer, from: demoUserId)
let payment = try ilpClient.sendPayment(paymentRequest,
                                        withAuthorization: demoUserAuthToken)

print("\nPayment sent!")
print("Amount sent: \(payment.amountSent)")
print("Amount delivered: \(payment.amountDelivered)")
print("Payment was \((payment.successfulPayment ? "successful!" : "unsuccessful!"))")

let balanceAfterPayment = try ilpClient.getBalance(for: demoUserId, withAuthorization: demoUserAuthToken);
print("Net balance after sending payment was \(balanceAfterPayment.netBalance)")
