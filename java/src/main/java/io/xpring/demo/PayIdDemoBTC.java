package io.xpring.demo;

import io.xpring.payid.generated.model.CryptoAddressDetails;
import io.xpring.payid.PayIdClient;
import io.xpring.payid.PayIdException;

public class PayIdDemoBTC {
  public static void main(String[] args) throws PayIdException {
    // The PayID to resolve.
    String payId = "alice$dev.payid.xpring.money";


    // The BTC network to resolve on.
    String btcNetwork = "btc-testnet";

    // A client to resolve PayIDs on any network.
    PayIdClient payIdClient = new PayIdClient();

    System.out.println("Resolving PayID: " + payId);
    System.out.println("On network: " + btcNetwork);
    CryptoAddressDetails btcAddressComponents = payIdClient.cryptoAddressForPayId(payId, btcNetwork);
    System.out.println("Resolved to " + btcAddressComponents.getAddress());
    System.out.println("");


  }
}