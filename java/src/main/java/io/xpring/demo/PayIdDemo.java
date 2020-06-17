package io.xpring.demo;

import io.xpring.common.XRPLNetwork;
import io.xpring.payid.generated.model.CryptoAddressDetails;
import io.xpring.payid.PayIDClient;
import io.xpring.payid.XRPPayIDClient;
import io.xpring.payid.PayIDException;

public class PayIdDemo {
  public static void main(String[] args) throws PayIDException {
    // The Pay ID to resolve.
    String payId = "alice$dev.payid.xpring.money";

    // The XRP Ledger network to resolve on.
    XRPLNetwork xrpNetwork = XRPLNetwork.MAIN;

    // The BTC network to resolve on.
    String btcNetwork = "btc-testnet";

    // A client to resolve PayIDs on the XRP Ledger.
    XRPPayIDClient xrpPayIdClient = new XRPPayIDClient(xrpNetwork);

    // A client to resolve PayIDs on the Bitcoin network.
    PayIDClient btcPayIdClient = new PayIDClient(btcNetwork);

    System.out.println("Resolving Pay ID: " + payId);
    System.out.println("On network: " + xrpNetwork);

    String xrpAddress = xrpPayIdClient.xrpAddressForPayID(payId);
    System.out.println("Resolved to " + xrpAddress);
    System.out.println("");

    System.out.println("Resolving Pay ID: " + payId);
    System.out.println("On network: " + btcNetwork);
    CryptoAddressDetails btcAddressComponents = btcPayIdClient.addressForPayID(payId);
    System.out.println("Resolved to " + btcAddressComponents.getAddress());
  }
}
