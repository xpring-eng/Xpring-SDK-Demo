const { IlpClient } = require("xpring-js")

const grpcUrl = 'hermes-grpc.ilpv4.dev'
const demoUserId = "demo_user"
const demoUserAuthToken = "2S1PZh3fEKnKg"

async function main() {

  console.log("\nUsing Hermes node located at: " + grpcUrl + "\n")
  const ilpClient = new IlpClient(grpcUrl);

  console.log("Retrieving balance for " + demoUserId + "...")
  const balance = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance was " + balance.getNetBalance() + " with asset scale " + balance.getAssetScale())

  const receiverPaymentPointer = "$money.ilpv4.dev/demo_receiver";
  let amountToSend = 100;
  console.log("\nSending payment:")
  console.log("- From: " + demoUserId)
  console.log("- To: " + receiverPaymentPointer)
  console.log("- Amount: " + amountToSend + " drops")
  const payment = await ilpClient.send(amountToSend, receiverPaymentPointer, demoUserId, demoUserAuthToken);

  console.log("\nPayment sent!")
  console.log("Amount sent: " + payment.getAmountSent())
  console.log("Amount delivered: " + payment.getAmountDelivered())
  console.log("Payment was " + (payment.getSuccessfulPayment() ? 'successful!' : 'unsuccessful!'))

  const balanceAfterPayment = await ilpClient.getBalance(demoUserId, demoUserAuthToken);
  console.log("Net balance after sending payment was " + balanceAfterPayment.getNetBalance())
}

main()
