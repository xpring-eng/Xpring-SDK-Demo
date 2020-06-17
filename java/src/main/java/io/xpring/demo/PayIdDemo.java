package io.xpring.demo;

import io.xpring.payid.idiomatic.PayIdException;

public class PayIdDemo {
  public static void main(String[] args) throws PayIdException {
    // The Pay ID to resolve.
    String payId = "alice$dev.payid.xpring.money";

    // The XRP Ledger network to resolve on.
    XrplNetwork xrpNetwork = XrplNetwork.Main;

    // The BTC network to resolve on.
    String btcNetwork = "btc-testnet";

    // A client to resolve PayIDs on the XRP Ledger.
    XrpPayIdClient xrpPayIdClient = new XrpPayIdClient(xrpNetwork);

    // A client to resolve PayIDs on the Bitcoin network.
    PayIdClient btcPayIdClient = new PayIDClient(btcNetwork);

    System.out.println("Resolving Pay ID: " + payId);
    System.out.println("On network: " + xrpNetwork);

    String xrpAddress = xrpPayIdClient.xrpAddressForPayID(payId);
    System.out.println("Resolved to " + xrpAddress);
    System.out.println("");

    System.out.println("Resolving Pay ID: " + payId);
    System.out.println("On network: " + btcNetwork);
    CryptoAddressDetails addressDetails = btcPayIdClient.addressForPayID(payId);
    System.out.println("Resolved to " + btcAddressComponents.getAddress());
  }
}
