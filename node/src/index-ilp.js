const { IlpClient, PaymentRequest } = require("xpring-js")
const BigInt = require('big-integer')

const grpcUrl = 'stg.grpcng.wallet.xpring.io'
const demoUserId = "sdk_account1"
const demoUserAuthToken = "password"

async function main() {
  console.log("\nUsing Hermes node located at: " + grpcUrl + "\n")
  const ilpClient = new IlpClient(grpcUrl);

  console.log("Retrieving balance for " + demoUserId + "...")
  const balance = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance was " + balance.netBalance + " with asset scale " + balance.assetScale)

  const receiverPaymentPointer = "$stage.xpring.money/demo_receiver";
  let amountToSend = BigInt(100);
  console.log("\nSending payment:")
  console.log("- From: " + demoUserId)
  console.log("- To: " + receiverPaymentPointer)
  console.log("- Amount: " + amountToSend + " drops")

  const paymentRequest = new PaymentRequest({
    amount: amountToSend,
    destinationPaymentPointer: receiverPaymentPointer,
    senderAccountId: demoUserId
  })

  const payment = await ilpClient.sendPayment(paymentRequest, demoUserAuthToken);

  console.log("\nPayment sent!")
  console.log("Amount sent: " + payment.amountSent)
  console.log("Amount delivered: " + payment.amountDelivered)
  console.log("Payment was " + (payment.successfulPayment ? 'successful!' : 'unsuccessful!'))

  const balanceAfterPayment = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance after sending payment was " + balanceAfterPayment.netBalance)
}

// Exit with an error code if there is an error. 
process.on('unhandledRejection', error => {
  console.log(`Fatal: ${error}`)
  process.exit(1)
});

main()
