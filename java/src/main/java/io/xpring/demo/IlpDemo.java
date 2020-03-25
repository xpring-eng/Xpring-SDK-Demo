package io.xpring.demo;

import com.google.common.primitives.UnsignedLong;
import io.xpring.ilp.IlpClient;
import io.xpring.ilp.model.AccountBalance;
import io.xpring.ilp.model.PaymentRequest;
import io.xpring.ilp.model.PaymentResult;
import io.xpring.xrpl.XpringException;

public class IlpDemo {

    public static void main(String[] args) throws XpringException {
        String grpcUrl = "hermes-grpc-test.xpring.dev";
        String demoUserId = "demo_user";
        String demoUserAuthToken = "2S1PZh3fEKnKg";

        System.out.println("\nUsing Hermes node located at: " + grpcUrl + "\n");
        IlpClient ilpClient = new IlpClient(grpcUrl);

        System.out.println("Retrieving balance for " + demoUserId + "...");
        AccountBalance balance = ilpClient.getBalance(demoUserId, demoUserAuthToken);
        System.out.println("Net balance was " + balance.netBalance() + " with asset scale " + balance.assetScale());

        String receiverPaymentPointer = "$xpring.money/demo_receiver";
        UnsignedLong amountToSend = UnsignedLong.valueOf(100);
        System.out.println("Sending payment:");
        System.out.println("- From: " + demoUserId);
        System.out.println("- To: " + receiverPaymentPointer);
        System.out.println("- Amount: " + amountToSend + " drops");

        PaymentRequest paymentRequest = PaymentRequest.builder()
          .amount(amountToSend)
          .destinationPaymentPointer(receiverPaymentPointer)
          .senderAccountId(demoUserId)
          .build();
        PaymentResult payment = ilpClient.sendPayment(paymentRequest, demoUserAuthToken);

        System.out.println("Payment sent!");
        System.out.println("Amount sent: " + payment.amountSent());
        System.out.println("Amount delivered: " + payment.amountDelivered());
        System.out.println("Payment was " + (payment.successfulPayment() ? "successful!" : "unsuccessful!"));

        AccountBalance balanceAfterPayment = ilpClient.getBalance(demoUserId, demoUserAuthToken);
        System.out.println("Net balance after sending payment was " + balanceAfterPayment.netBalance());
    }
}
