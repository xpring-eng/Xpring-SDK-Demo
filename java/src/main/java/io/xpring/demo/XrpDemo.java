package io.xpring.demo;

import io.xpring.common.XRPLNetwork;
import io.xpring.xrpl.*;
import io.xpring.xrpl.model.XRPTransaction;

import java.math.BigInteger;
import java.util.List;

public class XrpDemo {
    public static void main(String[] args) throws XRPException {
        // A URL to reach the remote rippled node at.
        // Some options:
        //     dev.xrp.xpring.io:50051
        //     test.xrp.xpring.io:50051
        //     main.xrp.xpring.io:50051
        String grpcAddress = "test.xrp.xpring.io:50051";

        // A wallet that exists on Testnet.
        String seed = "snYP7oArxKepd3GPDcrjMsJYiJeJB";
        Wallet  wallet = new Wallet(seed);

        // A recipient address.
        String recipientAddress = "X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4";
        BigInteger dropsToSend = BigInteger.valueOf(10);

        // Instantiate an XRPClient connected to the XRP Ledger Testnet
        System.out.println("\nUsing rippled node located at: " + grpcAddress + "\n");
        XRPClient xrpClient = new XRPClient(grpcAddress, XRPLNetwork.TEST);

        // Get account balance
        System.out.println("Retrieving balance for" +  wallet.getAddress() + "..");
        BigInteger balance = xrpClient.getBalance(wallet.getAddress());

        System.out.println("Balance was " + balance + " drops!\n");

        // Send XRP
        System.out.println("Sending:");
        System.out.println("- Drops " + dropsToSend );
        System.out.println("- To: " + recipientAddress);
        System.out.println("- From: " + wallet.getAddress() + "\n");
        String hash = xrpClient.send(dropsToSend, recipientAddress, wallet);

        // Check status of the payment
        System.out.println("Hash for transaction:\n" + hash + "\n");

        TransactionStatus status = xrpClient.getPaymentStatus( hash);
        System.out.println("Result for transaction is:\n" + status + "\n");

        // Retrieve full payment history for account
        System.out.println("Payment history for account " + wallet.getAddress() +":\n");
        List<XRPTransaction> paymentHistory = xrpClient.paymentHistory(wallet.getAddress());
        List<XRPTransaction> shortPaymentHistory = paymentHistory
                                                        .subList(0, Integer.min(paymentHistory.size(), 5));
        for (XRPTransaction transaction : shortPaymentHistory) {
            System.out.println(transaction);
        }
    }
}
