package io.xpring.demo;

import io.xpring.payid.idiomatic.PayIdException;

public class XpringDemo {
  public static void main(String[] args) {
    // The expected address of the gRPC server.
    String grpcURL = "test.xrp.xpring.io:50051";

    // A wallet with funds on testnet.
    Wallet wallet = new Wallet("snYP7oArxKepd3GPDcrjMsJYiJeJB", true);

    // The number of drops to send.
    long dropsToSend = 10;

    // The Pay ID to resolve.
    String payID = "alice$dev.payid.xpring.money";

    // The network to resolve on.
    XrplNetwork network = XrplNetwork.Test;

    System.out.println("\nUsing rippled node located at: " + grpcURL + "\n");
    XrpClient xrpClient = new XrpClient(grpcURL, network);

    System.out.println("Using network: " + network + "\n");
    XrpPayIdClient payIdClient = new XrpPayIdClient(network);

    XpringClient xpringClient = new XpringClient(payIdClient, xrpClient);

    System.out.println("Sending:");
    System.out.println("- Drops " + dropsToSend)
    System.out.println("- To: " + payID);
    System.out.println("- From: " + wallet.getAddress() + "\n");
    String hash = xpringClient.send(dropsToSend, payID, wallet);

    System.out.println("Hash for transaction:\n" + hash + "\n");

    TransactionStataus status = xrpClient.getPaymentStatus(hash);

    System.out.println("Result for transaction is:\n" + status + "\n");
  }
}
