package org.interledger.spsp.server.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonDeserialize(as = ImmutableCreateAccountRestRequest.class)
public interface CreateAccountRestRequest {

  static ImmutableCreateAccountRestRequest.Builder builder() {
    return ImmutableCreateAccountRestRequest.builder();
  }

  String accountId();

  @Value.Default
  default String assetCode() {
    return "XRP";
  };

  @Value.Default
  default int assetScale() {
    return 9;
  };

  @Value.Default
  default String description() {
    return "";
  };

}
