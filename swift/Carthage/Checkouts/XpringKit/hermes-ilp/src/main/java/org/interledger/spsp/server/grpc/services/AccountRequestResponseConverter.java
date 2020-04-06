package org.interledger.spsp.server.grpc.services;

import static org.interledger.spsp.server.services.HermesUtils.paymentPointerFromSpspUrl;

import org.interledger.connector.accounts.AccountBalanceSettings;
import org.interledger.connector.accounts.AccountId;
import org.interledger.connector.accounts.AccountRelationship;
import org.interledger.connector.accounts.AccountSettings;
import org.interledger.connector.accounts.SettlementEngineDetails;
import org.interledger.link.http.IlpOverHttpLink;
import org.interledger.link.http.IlpOverHttpLinkSettings;
import org.interledger.link.http.IncomingLinkSettings;
import org.interledger.link.http.OutgoingLinkSettings;
import org.interledger.spsp.server.grpc.CreateAccountRequest;
import org.interledger.spsp.server.grpc.CreateAccountResponse;
import org.interledger.spsp.server.grpc.GetAccountResponse;
import org.interledger.spsp.server.grpc.SendPaymentResponse;
import org.interledger.spsp.server.model.CreateAccountRestRequest;
import org.interledger.spsp.server.services.HermesUtils;
import org.interledger.stream.SendMoneyResult;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import okhttp3.HttpUrl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class AccountRequestResponseConverter {

  private static Logger logger = LoggerFactory.getLogger(AccountRequestResponseConverter.class);

  public static GetAccountResponse createGetAccountResponseFromAccountSettings(AccountSettings accountSettings, HttpUrl spspReceiverUrl) {

    long maxPacketAmount = accountSettings.maximumPacketAmount().isPresent() ?
      accountSettings.maximumPacketAmount().get().longValue() : 0L;

    // TODO: Maybe there is a way to copy properties to reduce some of this code
    // Convert AccountSettings into CreateAccountResponse
    AccountBalanceSettings accountBalanceSettings = accountSettings.balanceSettings();
    GetAccountResponse.Builder protoResponseBuilder = GetAccountResponse.newBuilder()
      .setAccountRelationship(accountSettings.accountRelationship().toString())
      .setAssetCode(accountSettings.assetCode())
      .setAssetScale(accountSettings.assetScale())
      .setMaximumPacketAmount(maxPacketAmount)
      .putAllCustomSettings(settingsMapToGrpcSettingsMap(accountSettings.customSettings()))
      .setAccountId(accountSettings.accountId().value())
      .setCreatedAt(accountSettings.createdAt().toString())
      .setModifiedAt(accountSettings.modifiedAt().toString())
      .setDescription(accountSettings.description())
      .setLinkType(accountSettings.linkType().value())
      .setIsInternal(accountSettings.isInternal())
      .setIsConnectionInitiator(accountSettings.isConnectionInitiator())
      .setIlpAddressSegment(accountSettings.ilpAddressSegment())
      .setIsSendRoutes(accountSettings.isSendRoutes())
      .setIsReceiveRoutes(accountSettings.isReceiveRoutes())
      .setPaymentPointer(paymentPointerFromSpspUrl(spspReceiverUrl, accountSettings.accountId()).toString());


    GetAccountResponse.BalanceSettings.Builder balanceSettingsBuilder = GetAccountResponse.BalanceSettings.newBuilder()
      .setSettleTo(accountBalanceSettings.settleTo());
    accountBalanceSettings.minBalance().ifPresent(
      minBalance -> balanceSettingsBuilder.setMinBalance(accountBalanceSettings.minBalance().get())
    );
    accountBalanceSettings.settleThreshold().ifPresent(
      minBalance -> balanceSettingsBuilder.setSettleThreshold(accountBalanceSettings.settleThreshold().get())
    );

    protoResponseBuilder.setBalanceSettings(balanceSettingsBuilder.build());

    accountSettings.rateLimitSettings().maxPacketsPerSecond().ifPresent(
      max -> protoResponseBuilder.setMaximumPacketAmount(accountSettings.rateLimitSettings().maxPacketsPerSecond().get())
    );

    Optional<SettlementEngineDetails> settlementEngineDetails = accountSettings.settlementEngineDetails();
    GetAccountResponse.SettlementEngineDetails.Builder settlementEngineBuilder = GetAccountResponse.SettlementEngineDetails.newBuilder();
    settlementEngineDetails.ifPresent(
      settle -> {
        settlementEngineDetails.get().settlementEngineAccountId().ifPresent(
          accountId -> settlementEngineBuilder.setSettlementEngineAccountId(settlementEngineDetails.get().settlementEngineAccountId().get().value())
        );

        settlementEngineBuilder.setBaseUrl(settlementEngineDetails.get().baseUrl() == null ? null : settlementEngineDetails.get().baseUrl().toString());

        settlementEngineBuilder.putAllCustomSettings(settingsMapToGrpcSettingsMap(settlementEngineDetails.get().customSettings()));
      });

    return protoResponseBuilder
      .setIsParentAccount(accountSettings.isParentAccount())
      .setIsChildAccount(accountSettings.isChildAccount())
      .setIsPeerAccount(accountSettings.isPeerAccount())
      .setIsPeerOrParentAccount(accountSettings.isPeerOrParentAccount())
      .putAllCustomSettings(settingsMapToGrpcSettingsMap(accountSettings.customSettings()))
      .build();
  }

  public static CreateAccountResponse.Builder generateCreateAccountResponseFromAccountSettings(AccountSettings accountSettings,
                                                                                               HttpUrl spspReceiverUrl) {

    long maxPacketAmount = accountSettings.maximumPacketAmount().isPresent() ?
      accountSettings.maximumPacketAmount().get().longValue() : 0L;

    // TODO: Maybe there is a way to copy properties to reduce some of this code
    // Convert AccountSettings into CreateAccountResponse
    AccountBalanceSettings accountBalanceSettings = accountSettings.balanceSettings();
    CreateAccountResponse.Builder protoResponseBuilder = CreateAccountResponse.newBuilder()
      .setAccountRelationship(accountSettings.accountRelationship().toString())
      .setAssetCode(accountSettings.assetCode())
      .setAssetScale(accountSettings.assetScale())
      .setMaximumPacketAmount(maxPacketAmount)
      .putAllCustomSettings(settingsMapToGrpcSettingsMap(accountSettings.customSettings()))
      .setAccountId(accountSettings.accountId().value())
      .setCreatedAt(accountSettings.createdAt().toString())
      .setModifiedAt(accountSettings.modifiedAt().toString())
      .setDescription(accountSettings.description())
      .setLinkType(accountSettings.linkType().value())
      .setIsInternal(accountSettings.isInternal())
      .setIsConnectionInitiator(accountSettings.isConnectionInitiator())
      .setIlpAddressSegment(accountSettings.ilpAddressSegment())
      .setIsSendRoutes(accountSettings.isSendRoutes())
      .setIsReceiveRoutes(accountSettings.isReceiveRoutes())
      .setPaymentPointer(HermesUtils.paymentPointerFromSpspUrl(spspReceiverUrl, accountSettings.accountId()).toString());


    CreateAccountResponse.BalanceSettings.Builder balanceSettingsBuilder = CreateAccountResponse.BalanceSettings.newBuilder()
      .setSettleTo(accountBalanceSettings.settleTo());
    accountBalanceSettings.minBalance().ifPresent(
      minBalance -> balanceSettingsBuilder.setMinBalance(accountBalanceSettings.minBalance().get())
    );
    accountBalanceSettings.settleThreshold().ifPresent(
      minBalance -> balanceSettingsBuilder.setSettleThreshold(accountBalanceSettings.settleThreshold().get())
    );

    protoResponseBuilder.setBalanceSettings(balanceSettingsBuilder.build());

    accountSettings.rateLimitSettings().maxPacketsPerSecond().ifPresent(
      max -> protoResponseBuilder.setMaximumPacketAmount(accountSettings.rateLimitSettings().maxPacketsPerSecond().get())
    );

    Optional<SettlementEngineDetails> settlementEngineDetails = accountSettings.settlementEngineDetails();
    CreateAccountResponse.SettlementEngineDetails.Builder settlementEngineBuilder = CreateAccountResponse.SettlementEngineDetails.newBuilder();
    settlementEngineDetails.ifPresent(
      settle -> {
        settlementEngineDetails.get().settlementEngineAccountId().ifPresent(
          accountId -> settlementEngineBuilder.setSettlementEngineAccountId(settlementEngineDetails.get().settlementEngineAccountId().get().value())
        );

        settlementEngineBuilder.setBaseUrl(settlementEngineDetails.get().baseUrl() == null ? null : settlementEngineDetails.get().baseUrl().toString());

        settlementEngineBuilder.putAllCustomSettings(settingsMapToGrpcSettingsMap(settlementEngineDetails.get().customSettings()));
      });

    return protoResponseBuilder
      .setIsParentAccount(accountSettings.isParentAccount())
      .setIsChildAccount(accountSettings.isChildAccount())
      .setIsPeerAccount(accountSettings.isPeerAccount())
      .setIsPeerOrParentAccount(accountSettings.isPeerOrParentAccount())
      .putAllCustomSettings(settingsMapToGrpcSettingsMap(accountSettings.customSettings()));
  }

  private static Map<String, String> settingsMapToGrpcSettingsMap(Map<String, Object> settingsMap) {
    return settingsMap.entrySet()
      .stream()
      .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().toString()));
  }

  public static AccountSettings accountSettingsFromCreateAccountRequest(String authToken,
                                                                        CreateAccountRequest createAccountRequest,
                                                                        OutgoingLinkSettings outgoingLinkSettings) {

    return AccountSettings.builder()
      .accountId(AccountId.of(createAccountRequest.getAccountId()))
      .assetCode(createAccountRequest.getAssetCode())
      .assetScale(createAccountRequest.getAssetScale())
      .description(createAccountRequest.getDescription())
      .accountRelationship(AccountRelationship.CHILD)
      .linkType(IlpOverHttpLink.LINK_TYPE)
      .customSettings(customSettingsFromAuthToken(authToken, outgoingLinkSettings))
      .build();
  }

  public static AccountSettings accountSettingsFromCreateAccountRequest(String authToken,
                                                                        CreateAccountRestRequest createAccountRequest,
                                                                        OutgoingLinkSettings outgoingLinkSettings) {

    return AccountSettings.builder()
      .accountId(AccountId.of(createAccountRequest.accountId()))
      .assetCode(createAccountRequest.assetCode())
      .assetScale(createAccountRequest.assetScale())
      .description(createAccountRequest.description())
      .accountRelationship(AccountRelationship.CHILD)
      .linkType(IlpOverHttpLink.LINK_TYPE)
      .customSettings(customSettingsFromAuthToken(authToken, outgoingLinkSettings))
      .build();
  }

  private static Map<String, Object> customSettingsFromAuthToken(String authToken,
                                                                 OutgoingLinkSettings outgoingLinkSettings) {
    Map<String, Object> customSettings;
    try {
      DecodedJWT maybeDecodedJwt = JWT.decode(authToken);
      customSettings = customSettingsFromJwt(maybeDecodedJwt);
    } catch (JWTDecodeException e) {
      logger.debug("Unable to decode auth token as JWT. Treating auth token as SIMPLE.");
      customSettings = customSettingsFromSimpleToken(authToken);
    }

    customSettings.putAll(outgoingLinkSettings.toCustomSettingsMap());
    return customSettings;
  }

  private static Map<String, Object> customSettingsFromSimpleToken(String simpleAuthToken) {
    Map<String, Object> customSettings = new HashMap<>();
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE, IlpOverHttpLinkSettings.AuthType.SIMPLE);
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN, simpleAuthToken);

    return customSettings;
  }

  private static Map<String, Object> customSettingsFromJwt(DecodedJWT decodedJwt) {

    Map<String, Object> customSettings = new HashMap<>();
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE, IlpOverHttpLinkSettings.AuthType.JWT_RS_256);
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_ISSUER, decodedJwt.getIssuer());
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_AUDIENCE, decodedJwt.getAudience().get(0));
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_SUBJECT, decodedJwt.getSubject());

    return customSettings;
  }

  public static SendPaymentResponse sendPaymentResponseFromSendMoneyResult(SendMoneyResult result) {
    return SendPaymentResponse.newBuilder()
      .setOriginalAmount(result.originalAmount().longValue())
      .setAmountDelivered(result.amountDelivered().longValue())
      .setAmountSent(result.amountSent().longValue())
      .setSuccessfulPayment(result.successfulPayment())
      .build();
  }
}
