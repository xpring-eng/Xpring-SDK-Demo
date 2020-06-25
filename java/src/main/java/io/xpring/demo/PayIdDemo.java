package io.xpring.demo;

import io.xpring.common.XrplNetwork;
import io.xpring.payid.generated.model.CryptoAddressDetails;
import io.xpring.payid.PayIdClient;
import io.xpring.payid.XrpPayIdClient;
import io.xpring.payid.PayIdException;

public class PayIdDemo {
  public static void main(String[] args) throws PayIdException {
    // The Pay ID to resolve.
    String payId = "alice$dev.payid.xpring.money";

    // The XRP Ledger network to resolve on.
    XrplNetwork xrpNetwork = XrplNetwork.MAIN;

    // The BTC network to resolve on.
    String btcNetwork = "btc-testnet";

    // A client to resolve PayIDs on any network..
    PayIdClient btcPayIdClient = new PayIdClient();

    // A client to resolve PayIDs on the XRP Ledger.
    XrpPayIdClient xrpPayIdClient = new XrpPayIdClient(xrpNetwork);

    System.out.println("Resolving PayID: " + payId);
    System.out.println("On network: " + btcNetwork);
    CryptoAddressDetails btcAddressComponents = btcPayIdClient.cryptoAddressForPayId(payId, btcNetwork);
    System.out.println("Resolved to " + btcAddressComponents.getAddress());
    System.out.println("");

    System.out.println("Resolving PayID: " + payId);
    System.out.println("On network: " + xrpNetwork);
    String xrpAddress = xrpPayIdClient.xrpAddressForPayId(payId);
    System.out.println("Resolved to " + xrpAddress);
  }
}
