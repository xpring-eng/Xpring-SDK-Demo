package org.interledger.spsp.server.client;

import org.interledger.connector.accounts.AccountSettings;
import org.interledger.spsp.PaymentPointer;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableAccountSettingsResponse.class)
@JsonDeserialize(as = ImmutableAccountSettingsResponse.class)
@JsonPropertyOrder( {"accountId", "createdAt", "modifiedAt", "description", "accountRelationship", "assetCode",
  "assetScale", "maximumPacketAmount", "linkType", "ilpAddressSegment", "connectionInitiator",
  "internal", "sendRoutes", "receiveRoutes", "balanceSettings", "rateLimitSettings",
  "settlementEngineDetails", "customSettings", "paymentPointer"})
public interface AccountSettingsResponse extends AccountSettings {

  static ImmutableAccountSettingsResponse.Builder builder() {
    return ImmutableAccountSettingsResponse.builder();
  }

  PaymentPointer paymentPointer();

  @Value.Immutable
  @Value.Modifiable
  @JsonSerialize(as = ImmutableAccountSettingsResponse.class)
  @JsonDeserialize(as = ImmutableAccountSettingsResponse.class)
  @JsonPropertyOrder( {"accountId", "createdAt", "modifiedAt", "description", "accountRelationship", "assetCode",
    "assetScale", "maximumPacketAmount", "linkType", "ilpAddressSegment", "connectionInitiator",
    "internal", "sendRoutes", "receiveRoutes", "balanceSettings", "rateLimitSettings",
    "settlementEngineDetails", "customSettings", "paymentPointer"})
  abstract class AbstractAccountSettingsResponse implements AccountSettingsResponse {

    @Override
    @JsonProperty("paymentPointer")
    public abstract PaymentPointer paymentPointer();
  }
}
