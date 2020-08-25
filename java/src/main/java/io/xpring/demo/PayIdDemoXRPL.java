package io.xpring.demo;

import io.xpring.common.XrplNetwork;
import io.xpring.payid.XrpPayIdClient;
import io.xpring.payid.PayIdException;

public class PayIdDemoXRPL {
  public static void main(String[] args) throws PayIdException {
    // The PayID to resolve.
    String payId = "alice$dev.payid.xpring.money";

    // The XRP Ledger network to resolve on.
    XrplNetwork xrpNetwork = XrplNetwork.MAIN;


    // A client to resolve PayIDs on the XRP Ledger.
    XrpPayIdClient xrpPayIdClient = new XrpPayIdClient(xrpNetwork);

    System.out.println("Resolving PayID: " + payId);
    System.out.println("On network: " + xrpNetwork);
    String xrpAddress = xrpPayIdClient.xrpAddressForPayId(payId);
    System.out.println("Resolved to " + xrpAddress);
    System.out.println("");

  }
}