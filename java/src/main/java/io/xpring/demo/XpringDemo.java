package io.xpring.demo;

import io.xpring.payid.PayIDException;
import io.xpring.xrpl.TransactionStatus;
import io.xpring.xrpl.Wallet;
import io.xpring.common.XRPLNetwork;
import io.xpring.xrpl.XRPClient;
import io.xpring.payid.XRPPayIDClient;
import io.xpring.xpring.XpringClient;
import io.xpring.xrpl.XRPException;

import java.math.BigInteger;

public class XpringDemo {
  public static void main(String[] args) throws PayIDException, XRPException {
    // The expected address of the gRPC server.
    String grpcURL = "test.xrp.xpring.io:50051";

    // A wallet with funds on testnet.
    Wallet wallet = new Wallet("snYP7oArxKepd3GPDcrjMsJYiJeJB", true);

    // The number of drops to send.
    BigInteger dropsToSend = BigInteger.valueOf(10);

    // The Pay ID to resolve.
    String payID = "alice$dev.payid.xpring.money";

    // The network to resolve on.
    XRPLNetwork network = XRPLNetwork.TEST;

    System.out.println("\nUsing rippled node located at: " + grpcURL + "\n");
    XRPClient xrpClient = new XRPClient(grpcURL, network);

    System.out.println("Using network: " + network + "\n");
    XRPPayIDClient payIdClient = new XRPPayIDClient(network);

    XpringClient xpringClient = new XpringClient(payIdClient, xrpClient);

    System.out.println("Sending:");
    System.out.println("- Drops " + dropsToSend);
    System.out.println("- To: " + payID);
    System.out.println("- From: " + wallet.getAddress() + "\n");
    String hash = xpringClient.send(dropsToSend, payID, wallet);

    System.out.println("Hash for transaction:\n" + hash + "\n");

    TransactionStatus status = xrpClient.getPaymentStatus(hash);

    System.out.println("Result for transaction is:\n" + status + "\n");
  }
}
