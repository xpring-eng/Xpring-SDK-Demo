package org.interledger.spsp.server.services;

import org.interledger.connector.accounts.AccountId;
import org.interledger.spsp.PaymentPointer;

import okhttp3.HttpUrl;

public class HermesUtils {

  public static PaymentPointer paymentPointerFromSpspUrl(HttpUrl spspUrl, AccountId accountId) {
    String host = spspUrl.host();

    // Don't need port if a no non-default is specified
    if (spspUrl.port() != 80 && spspUrl.port() != 443) {
      host += ":" + spspUrl.port();
    }
    return PaymentPointer.of("$" + host + "/" + accountId.value());
  }
}
