package org.interledger.spsp.server.controllers;

import static org.interledger.spsp.server.services.HermesUtils.paymentPointerFromSpspUrl;

import org.interledger.connector.accounts.AccountId;
import org.interledger.connector.accounts.AccountNotFoundProblem;
import org.interledger.connector.accounts.AccountSettings;
import org.interledger.connector.client.ConnectorAdminClient;
import org.interledger.spsp.server.client.AccountSettingsResponse;
import org.interledger.spsp.server.model.CreateAccountRestRequest;
import org.interledger.spsp.server.services.NewAccountService;
import org.interledger.spsp.server.util.OptionalAuthToken;

import feign.FeignException;
import okhttp3.HttpUrl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zalando.problem.spring.common.MediaTypes;

import java.util.Objects;
import java.util.Optional;


@RestController
public class AccountController extends AbstractController {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  private final NewAccountService newAccountService;

  private final ConnectorAdminClient adminClient;

  private final HttpUrl spspReceiverUrl;

  public AccountController(NewAccountService newAccountService,
                           ConnectorAdminClient adminClient,
                           HttpUrl spspReceiverUrl) {
    this.newAccountService = Objects.requireNonNull(newAccountService);
    this.adminClient = Objects.requireNonNull(adminClient);
    this.spspReceiverUrl = Objects.requireNonNull(spspReceiverUrl);
  }

  @RequestMapping(
    value = "/accounts", method = {RequestMethod.POST},
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaTypes.PROBLEM_VALUE}
  )
  public AccountSettingsResponse createAccount(@RequestHeader("Authorization") Optional<String> authToken,
                                       @RequestBody Optional<CreateAccountRestRequest> createAccountRequest) {

    try {
      // Give a choice of passing in a JWT or simple auth token, or having Hermes generate a Simple token
      AccountSettings accountSettings = newAccountService
        .createAccount(OptionalAuthToken.of(authToken), createAccountRequest);

      // Add a payment pointer to the response
      return AccountSettingsResponse.builder()
        .from(accountSettings)
        .paymentPointer(paymentPointerFromSpspUrl(spspReceiverUrl, accountSettings.accountId()))
        .build();
    }
    catch (FeignException e) {
      throw new ResponseStatusException(HttpStatus.valueOf(e.status()), e.contentUTF8());
    }
  }

  @RequestMapping(
    value = "/accounts/{accountId}",
    method = {RequestMethod.GET},
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaTypes.PROBLEM_VALUE}
  )
  public AccountSettingsResponse getAccount(@PathVariable("accountId") String accountId) {
    try {
      AccountSettings accountSettings = adminClient.findAccount(accountId)
        .orElseThrow(() -> new AccountNotFoundProblem(AccountId.of(accountId)));

      // Add a payment pointer to the response
      return AccountSettingsResponse.builder()
        .from(accountSettings)
        .paymentPointer(paymentPointerFromSpspUrl(spspReceiverUrl, accountSettings.accountId()))
        .build();
    } catch (AccountNotFoundProblem e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
    } catch (FeignException e) {
      throw new ResponseStatusException(HttpStatus.valueOf(e.status()), e.contentUTF8());
    }
  }

  @RequestMapping(
    value = "/accounts/rainmaker", method = {RequestMethod.POST},
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaTypes.PROBLEM_VALUE}
  )
  public AccountSettings createRainmaker() {
    try {
      return newAccountService.createRainmaker();
    }
    catch (FeignException e) {
      throw new ResponseStatusException(HttpStatus.valueOf(e.status()), e.contentUTF8());
    }
  }
}
