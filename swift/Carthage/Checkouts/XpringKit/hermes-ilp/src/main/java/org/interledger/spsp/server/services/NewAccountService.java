package org.interledger.spsp.server.services;

import org.interledger.connector.accounts.AccountId;
import org.interledger.connector.accounts.AccountRelationship;
import org.interledger.connector.accounts.AccountSettings;
import org.interledger.connector.client.ConnectorAdminClient;
import org.interledger.connector.routing.StaticRoute;
import org.interledger.core.InterledgerAddressPrefix;
import org.interledger.link.http.IlpOverHttpLink;
import org.interledger.link.http.IlpOverHttpLinkSettings;
import org.interledger.link.http.IncomingLinkSettings;
import org.interledger.link.http.OutgoingLinkSettings;
import org.interledger.spsp.server.client.ConnectorRoutesClient;
import org.interledger.spsp.server.grpc.CreateAccountRequest;
import org.interledger.spsp.server.grpc.services.AccountRequestResponseConverter;
import org.interledger.spsp.server.model.CreateAccountRestRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class NewAccountService {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  private final ConnectorAdminClient adminClient;

  private final ConnectorRoutesClient connectorRoutesClient;

  private final OutgoingLinkSettings spspLinkSettings;

  private final InterledgerAddressPrefix spspAddressPrefix;

  private final AccountGeneratorService accountGeneratorService;

  public NewAccountService(ConnectorAdminClient adminClient,
                           ConnectorRoutesClient connectorRoutesClient,
                           OutgoingLinkSettings spspLinkSettings,
                           InterledgerAddressPrefix spspAddressPrefix,
                           AccountGeneratorService accountGeneratorService) {
    this.adminClient = adminClient;
    this.connectorRoutesClient = connectorRoutesClient;
    this.spspLinkSettings = spspLinkSettings;
    this.spspAddressPrefix = spspAddressPrefix;
    this.accountGeneratorService = accountGeneratorService;
  }

  public AccountSettings createAccount(Optional<String> authToken, CreateAccountRequest request) {
    // Generate a random alpha-numeric string as a simple auth token,
    // after removing the token prefix from a possibly present auth token
    String credentials = authToken.orElse(accountGeneratorService.generateSimpleAuthCredentials());

    // Convert request to AccountSettings
    AccountSettings populatedAccountSettings =
      AccountRequestResponseConverter.accountSettingsFromCreateAccountRequest(credentials,
        accountGeneratorService.fillInCreateAccountRequest(request),
        spspLinkSettings);

    return revertSimpleAuthTokenUnencrypted(populatedAccountSettings, createAccount(populatedAccountSettings));
  }

  public AccountSettings createAccount(Optional<String> authToken, Optional<CreateAccountRestRequest> request) {

    // Generate a random alpha-numeric string as a simple auth token
    // after removing the token prefix from a possibly present auth token
    String credentials = authToken.orElse(accountGeneratorService.generateSimpleAuthCredentials());

    AccountSettings populatedAccountSettings =
      AccountRequestResponseConverter.accountSettingsFromCreateAccountRequest(credentials,
        accountGeneratorService.fillInCreateAccountRequest(request),
        spspLinkSettings);

    return revertSimpleAuthTokenUnencrypted(populatedAccountSettings, createAccount(populatedAccountSettings));
  }

  private AccountSettings revertSimpleAuthTokenUnencrypted(AccountSettings populatedAccountSettings, AccountSettings returnedAccountSettings) {
    if (returnedAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE).equals(IlpOverHttpLinkSettings.AuthType.SIMPLE.toString())) {
      String simpleAuthToken = populatedAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN).toString();
      Map<String, Object> customSettingsUnencrypted = revertSimpleAuthTokenCustomSetting(returnedAccountSettings.customSettings(), simpleAuthToken);

      return AccountSettings.builder()
        .from(returnedAccountSettings)
        .customSettings(customSettingsUnencrypted)
        .build();
    }

    return returnedAccountSettings;
  }

  private Map<String, Object> revertSimpleAuthTokenCustomSetting(Map<String, Object> encryptedCustomSettings, String simpleAuthToken) {
    Map<String, Object> newCustomSettings = new HashMap<>();
    encryptedCustomSettings.forEach((k, v) -> {
      if (k.equals(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN)) {
        newCustomSettings.put(k, simpleAuthToken);
      } else {
        newCustomSettings.put(k, v);
      }
    });

    return newCustomSettings;
  }

  public AccountSettings createAccount(AccountSettings request) {
    // Create account on the connector
    AccountSettings returnedAccountSettings = adminClient.createAccount(request);

    logger.info("Account created successfully with accountId: " + request.accountId());

    try {
      InterledgerAddressPrefix routePrefix = spspAddressPrefix.with(returnedAccountSettings.accountId().value());
      connectorRoutesClient.createStaticRoute(
        routePrefix.getValue(),
        StaticRoute.builder()
          .routePrefix(routePrefix)
          .nextHopAccountId(returnedAccountSettings.accountId())
          .build()
      );
    } catch (Exception e) {
      logger.warn("Failed to create route", e);
    }

    return returnedAccountSettings;
  }

  public AccountSettings createRainmaker() {
    Map<String, Object> customSettings = new HashMap<>();
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN, "password");
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE, IlpOverHttpLinkSettings.AuthType.SIMPLE.toString());
    customSettings.putAll(spspLinkSettings.toCustomSettingsMap());

    // Convert request to AccountSettings
    AccountSettings requestedAccountSettings = AccountSettings.builder()
      .accountId(AccountId.of("rainmaker"))
      .accountRelationship(AccountRelationship.PEER)
      .customSettings(customSettings)
      .assetScale(9)
      .assetCode("XRP")
      .linkType(IlpOverHttpLink.LINK_TYPE)
      .build();

    return createAccount(requestedAccountSettings);
  }

}
