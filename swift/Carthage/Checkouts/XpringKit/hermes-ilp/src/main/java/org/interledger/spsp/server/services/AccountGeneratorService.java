package org.interledger.spsp.server.services;

import org.interledger.spsp.server.grpc.CreateAccountRequest;
import org.interledger.spsp.server.model.CreateAccountRestRequest;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * A utility service for account creation, with methods for generating default accounts as well as simple auth tokens
 * and accountIds.
 */
@Service
public class AccountGeneratorService {
  
  /**
   * Generates a random alphanumeric string of length 13 to be used as credentials
   *
   * TODO: Use a library that generates more secure tokens
   * @return Random alphanumeric simple auth token with 13 characters
   */
  public String generateSimpleAuthCredentials() {
    return RandomStringUtils.randomAlphanumeric(13);
  }

  /**
   * If the request isnt empty, just return it, otherwise create a default account with a generated accountID
   * @param createAccountRequest a {@link Optional < CreateAccountRestRequest >} from a REST controller
   * @return a CreateAccountRestRequest (either given or generated)
   */
  public CreateAccountRestRequest fillInCreateAccountRequest(Optional<CreateAccountRestRequest> createAccountRequest) {
    return createAccountRequest.orElseGet(this::newDefaultCreateAccountRequest);
  }

  /**
   * Returns a {@link CreateAccountRequest} with any fields filled in with default values
   * @param createAccountRequest a {@link CreateAccountRequest} from a GRPC handler.
   * @return a CreateAccountRestRequest (either given or filled in by this method)
   */
  public CreateAccountRequest fillInCreateAccountRequest(CreateAccountRequest createAccountRequest) {

    // Purposely not setting auth token in proto object, as an auth token may be generated outside the proto object.
    // This will allow us to get rid of authToken from the proto object and instead pass it as an Authorization header
    return CreateAccountRequest.newBuilder()
      .setAccountId(createAccountRequest.getAccountId().isEmpty() ? generateAccountId() : createAccountRequest.getAccountId())
      .setAssetCode(createAccountRequest.getAssetCode().isEmpty() ? "XRP" : createAccountRequest.getAssetCode())
      .setAssetScale(createAccountRequest.getAssetScale() == 0 ? 9 : createAccountRequest.getAssetScale())
      .setDescription(createAccountRequest.getDescription())
      .build();
  }

  /**
   * Generates a {@link CreateAccountRestRequest} if none is given
   * @return a {@link CreateAccountRestRequest} with a generated accountId
   */
  public CreateAccountRestRequest newDefaultCreateAccountRequest() {
    return CreateAccountRestRequest.builder()
      .accountId(generateAccountId())
      .assetCode("XRP")
      .assetScale(9)
      .build();
  }

  /**
   * Generates an account ID with format user_{random 8 alphanumeric characters}
   * @return A String representing a generated account ID
   */
  public String generateAccountId() {
    return "user_" + RandomStringUtils.randomAlphanumeric(8);
  }


}
