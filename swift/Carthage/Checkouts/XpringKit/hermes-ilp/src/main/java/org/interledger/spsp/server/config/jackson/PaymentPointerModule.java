package org.interledger.spsp.server.config.jackson;

import org.interledger.spsp.PaymentPointer;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.module.SimpleModule;


/**
 * A Jackson {@link SimpleModule} for serializing and deserializing instances of {@link PaymentPointer}.
 */
public class PaymentPointerModule extends SimpleModule {

  private static final String NAME = "PaymentPointerModule";

  /**
   * No-args Constructor.
   */
  public PaymentPointerModule() {
    super(
      NAME,
      new Version(1, 0, 0, null, "org.interledger.connector",
        "payment-pointer")
    );

    addSerializer(PaymentPointer.class, new PaymentPointerSerializer());
    addDeserializer(PaymentPointer.class, new PaymentPointerDeserializer());
  }
}
