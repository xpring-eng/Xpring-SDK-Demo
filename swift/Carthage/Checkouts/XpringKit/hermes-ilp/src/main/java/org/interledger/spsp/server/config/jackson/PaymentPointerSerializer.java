package org.interledger.spsp.server.config.jackson;

import org.interledger.spsp.PaymentPointer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdScalarSerializer;

import java.io.IOException;

/**
 * Jackson serializer {@link PaymentPointer}.
 */
public class PaymentPointerSerializer extends StdScalarSerializer<PaymentPointer> {

  public PaymentPointerSerializer() {
    super(PaymentPointer.class, false);
  }

  @Override
  public void serialize(PaymentPointer paymentPointer, JsonGenerator gen, SerializerProvider provider) throws IOException {
    gen.writeString(paymentPointer.toString());
  }
}
