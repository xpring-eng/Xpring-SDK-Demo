const { IlpClient, PaymentRequest } = require("xpring-js")
const bigInt = require('big-integer')

const grpcUrl = 'hermes-grpc.ilpv4.dev'
const demoUserId = "demo_user"
const demoUserAuthToken = "2S1PZh3fEKnKg"

async function main() {

  console.log("\nUsing Hermes node located at: " + grpcUrl + "\n")
  const ilpClient = new IlpClient(grpcUrl);

  console.log("Retrieving balance for " + demoUserId + "...")
  const balance = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance was " + balance.netBalance + " with asset scale " + balance.assetScale)

  const receiverPaymentPointer = "$money.ilpv4.dev/demo_receiver";
  let amountToSend = 100;
  console.log("\nSending payment:")
  console.log("- From: " + demoUserId)
  console.log("- To: " + receiverPaymentPointer)
  console.log("- Amount: " + amountToSend + " drops")
  const request = new PaymentRequest({
    amount: bigInt(10),
    destinationPaymentPointer: '$money.ilpv4.dev/sdk_account2',
    senderAccountId: 'sdk_account1',
  })
  const payment = await ilpClient.sendPayment(request, demoUserAuthToken);

  console.log("\nPayment sent!")
  console.log("Amount sent: " + payment.amountSent)
  console.log("Amount delivered: " + payment.amountDelivered)
  console.log("Payment was " + (payment.successfulPayment? 'successful!' : 'unsuccessful!'))

  const balanceAfterPayment = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance after sending payment was " + balanceAfterPayment.netBalance)
}

main()
