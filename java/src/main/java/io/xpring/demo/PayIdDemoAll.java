package io.xpring.demo;

import java.util.List;

import io.xpring.payid.generated.model.Address;
import io.xpring.payid.PayIdClient;
import io.xpring.payid.PayIdException;

public class PayIdDemoAll {
  public static void main(String[] args) throws PayIdException {
    // The PayID to resolve.
    String payId = "alice$dev.payid.xpring.money";

    // A client to resolve PayIDs on any network.
    PayIdClient payIdClient = new PayIdClient();  

    System.out.println("Resolving All PayIDs for: " + payId);
    List<Address> allAddresses = payIdClient.allAddressesForPayId(payId);
    System.out.println("Resolved to:");
    for (int i = 0; i < allAddresses.size(); i++) {
      System.out.println(i + ") " + allAddresses.get(i));
    }
  }
}