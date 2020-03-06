package io.xpring.demo;

import org.interledger.spsp.server.grpc.GetBalanceResponse;
import org.interledger.spsp.server.grpc.SendPaymentResponse;

import com.google.common.primitives.UnsignedLong;
import io.xpring.ilp.IlpClient;
import io.xpring.xrpl.XpringException;

public class IlpDemo {

    public static void main(String[] args) throws XpringException {
        String grpcUrl = "hermes-grpc.ilpv4.dev";
        String demoUserId = "demo_user";
        String demoUserAuthToken = "2S1PZh3fEKnKg";

        System.out.println("\nUsing Hermes node located at: " + grpcUrl + "\n");
        IlpClient ilpClient = new IlpClient(grpcUrl);

        System.out.println("Retrieving balance for " + demoUserId + "...");
        GetBalanceResponse balance = ilpClient.getBalance(demoUserId, demoUserAuthToken);
        System.out.println("Net balance was " + balance.getNetBalance() + " with asset scale " + balance.getAssetScale());

        String receiverPaymentPointer = "$money.ilpv4.dev/demo_receiver";
        UnsignedLong amountToSend = UnsignedLong.valueOf(100);
        System.out.println("Sending payment:");
        System.out.println("- From: " + demoUserId);
        System.out.println("- To: " + receiverPaymentPointer);
        System.out.println("- Amount: " + amountToSend + " drops");

        SendPaymentResponse payment = ilpClient.sendPayment(receiverPaymentPointer, amountToSend, demoUserId, demoUserAuthToken);

        System.out.println("Payment sent!");
        System.out.println("Amount sent: " + payment.getAmountSent());
        System.out.println("Amount delivered: " + payment.getAmountDelivered());
        System.out.println("Payment was " + (payment.getSuccessfulPayment() ? "successful!" : "unsuccessful!"));

        GetBalanceResponse balanceAfterPayment = ilpClient.getBalance(demoUserId, demoUserAuthToken);
        System.out.println("Net balance after sending payment was " + balanceAfterPayment.getNetBalance());
    }
}
