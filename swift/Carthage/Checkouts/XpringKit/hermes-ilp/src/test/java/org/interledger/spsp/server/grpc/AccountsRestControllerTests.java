package org.interledger.spsp.server.grpc;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.google.common.net.HttpHeaders.AUTHORIZATION;
import static org.assertj.core.api.Assertions.assertThat;

import org.interledger.connector.accounts.AccountId;
import org.interledger.connector.client.ConnectorAdminClient;
import org.interledger.connector.jackson.ObjectMapperFactory;
import org.interledger.link.http.IlpOverHttpLinkSettings;
import org.interledger.link.http.ImmutableJwtAuthSettings;
import org.interledger.link.http.IncomingLinkSettings;
import org.interledger.link.http.JwtAuthSettings;
import org.interledger.spsp.PaymentPointer;
import org.interledger.spsp.server.HermesServerApplication;
import org.interledger.spsp.server.client.AccountSettingsResponse;
import org.interledger.spsp.server.client.ConnectorRoutesClient;
import org.interledger.spsp.server.controllers.AccountController;
import org.interledger.spsp.server.model.CreateAccountRestRequest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import okhttp3.HttpUrl;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
@SpringBootTest(
  classes = {HermesServerApplication.class, AccountsRestControllerTests.TestConfig.class},
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
  properties = {"spring.main.allow-bean-definition-overriding=true"})
public class AccountsRestControllerTests {
  /**
   * Fields for our JWKS mock server
   */
  public static final String WELL_KNOWN_JWKS_JSON = "/.well-known/jwks.json";
  public static final int WIRE_MOCK_PORT = 32456;
  HttpUrl issuer;
  private ObjectMapper objectMapper = ObjectMapperFactory.create();

  /**
   * This starts up a mock JWKS server
   */
  @Rule
  public WireMockRule wireMockRule = new WireMockRule(WIRE_MOCK_PORT);

  private JwksServer jwtServer;

  // Need this to have the JWKS port exposed to the connector running in the container
  static {
    Testcontainers.exposeHostPorts(WIRE_MOCK_PORT);
  }

  /**
   * Connector fields
   */
  private static final Network network = Network.newNetwork();
  private static final int CONNECTOR_PORT = 8080;

  /**
   * Admin token for creating the account for accountIdHermes
   */
  private AccountId accountIdHermes;
  public static final String ADMIN_AUTH_TOKEN = "YWRtaW46cGFzc3dvcmQ=";

  /**
   *  Start up a connector from the nightly docker image
   */
  @ClassRule
  public static GenericContainer interledgerNode = new GenericContainer<>("interledger4j/java-ilpv4-connector:0.2.0") // FIXME use nightly
    .withExposedPorts(CONNECTOR_PORT)
    .withNetwork(network);

  @Autowired
  private AccountController accountController;

    private String paymentPointerBase;

    @Autowired
    HttpUrl spspReceiverUrl;

  @Before
  public void setUp() throws JsonProcessingException {

    paymentPointerBase = "$" + spspReceiverUrl.host();
    if (spspReceiverUrl.port() != 80 && spspReceiverUrl.port() != 443) {
      paymentPointerBase += ":" + spspReceiverUrl.port();
    }

    // Set up the JWKS server
    jwtServer = new JwksServer();
    resetJwks();
    issuer = HttpUrl.parse("http://host.testcontainers.internal:" + wireMockRule.port());

    // Create an admin client to create a test account
    accountIdHermes = AccountId.of("hermes");
    JwtAuthSettings jwtAuthSettings = defaultAuthSettings(issuer);

    // Set up auth settings to use JWT_RS_256
    Map<String, Object> customSettings = new HashMap<>();
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE, IlpOverHttpLinkSettings.AuthType.JWT_RS_256);
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_ISSUER, jwtAuthSettings.tokenIssuer().get().toString());
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_AUDIENCE, jwtAuthSettings.tokenAudience().get());
    customSettings.put(IncomingLinkSettings.HTTP_INCOMING_TOKEN_SUBJECT, jwtAuthSettings.tokenSubject());
  }
  /**
   * Test that accounts created with a fully populated {@link org.interledger.spsp.server.model.CreateAccountRestRequest}
   * won't have anything overwritten
   */
  @Test
  public void testCreateAccountWithTokenAndFullRequest() {
    CreateAccountRestRequest request = CreateAccountRestRequest.builder()
      .accountId("foo")
      .assetCode("USD")
      .assetScale(6)
      .build();

    AccountSettingsResponse response = accountController.createAccount(Optional.of("Bearer password"), Optional.of(request));
    assertThat(response.accountId()).isEqualTo(AccountId.of("foo"));
    assertThat(response.assetCode()).isEqualTo("USD");
    assertThat(response.assetScale()).isEqualTo(6);
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE)).isEqualTo(IlpOverHttpLinkSettings.AuthType.SIMPLE.toString());
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN)).isEqualTo("password");
    assertThat(response.paymentPointer()).isEqualTo(PaymentPointer.of(paymentPointerBase + "/foo"));
  }

  /**
   * Test that we can create an account with a specified token but default account settings
   */
  @Test
  public void testCreateAccountWithTokenButNoRequest() {
    AccountSettingsResponse response = accountController.createAccount(Optional.of("password"), Optional.empty());
    assertThat(response.accountId().value()).startsWith("user_");
    assertThat(response.assetCode()).isEqualTo("XRP");
    assertThat(response.assetScale()).isEqualTo(9);
    assertThat(response.paymentPointer()).isEqualTo(PaymentPointer.of(paymentPointerBase + "/" + response.accountId()));
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE)).isEqualTo(IlpOverHttpLinkSettings.AuthType.SIMPLE.toString());
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN)).asString().isEqualTo("password");
  }

  /**
   * Test that we can pass nothing and create a default account with a generated auth token
   */
  @Test
  public void testCreateAccountWithNoTokenAndNoRequest() {
    AccountSettingsResponse response = accountController.createAccount(Optional.empty(), Optional.empty());
    assertThat(response.accountId().value()).startsWith("user_");
    assertThat(response.assetCode()).isEqualTo("XRP");
    assertThat(response.assetScale()).isEqualTo(9);
    assertThat(response.paymentPointer()).isEqualTo(PaymentPointer.of(paymentPointerBase + "/" + response.accountId()));
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE)).isEqualTo(IlpOverHttpLinkSettings.AuthType.SIMPLE.toString());
    assertThat(response.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_SIMPLE_AUTH_TOKEN)).asString().doesNotStartWith("enc:jks");
  }

  /**
   * Test that we can still create an account using a JWT and full account settings.
   * Tests compatibility with the xpring ilp wallet
   */
  @Test
  public void testCreateAccountWithJwtAndFullRequest() {
    String accountID = "AccountServiceGRPCTest";
    String accountDescription = "Noah's test account";

    JwtAuthSettings jwtAuthSettings = defaultAuthSettings(issuer);
    String jwt = jwtServer.createJwt(jwtAuthSettings, Instant.now().plusSeconds(10));

    CreateAccountRestRequest request = CreateAccountRestRequest.builder()
      .accountId(accountID)
      .assetCode("XRP")
      .assetScale(9)
      .description(accountDescription)
      .build();

    AccountSettingsResponse createdAccountSettings = accountController.createAccount(Optional.of(jwt), Optional.of(request));
    assertThat(createdAccountSettings.paymentPointer()).isEqualTo(PaymentPointer.of(paymentPointerBase + "/" + createdAccountSettings.accountId()));
    assertThat(createdAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_AUTH_TYPE)).isEqualTo(IlpOverHttpLinkSettings.AuthType.JWT_RS_256.toString());
    assertThat(createdAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_TOKEN_ISSUER)).isEqualTo(jwtAuthSettings.tokenIssuer().get().toString());
    assertThat(createdAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_TOKEN_AUDIENCE)).isEqualTo(jwtAuthSettings.tokenAudience().get());
    assertThat(createdAccountSettings.customSettings().get(IncomingLinkSettings.HTTP_INCOMING_TOKEN_SUBJECT)).isEqualTo(jwtAuthSettings.tokenSubject());
  }

  /**
   * Helper method to return the base URL for the Rust Connector.
   *
   * @return An {@link HttpUrl} to communicate with.
   */
  private static HttpUrl getInterledgerBaseUri() {
    return new HttpUrl.Builder()
      .scheme("http")
      .host(interledgerNode.getContainerIpAddress())
      .port(interledgerNode.getFirstMappedPort())
      .build();
  }

  private void resetJwks() throws JsonProcessingException {
    jwtServer.resetKeyPairs();
    WireMock.reset();
    stubFor(get(urlEqualTo(WELL_KNOWN_JWKS_JSON))
      .willReturn(aResponse()
        .withStatus(200)
        .withBody(objectMapper.writeValueAsString(jwtServer.getJwks()))
      ));
  }

  private ImmutableJwtAuthSettings defaultAuthSettings(HttpUrl issuer) {
    return JwtAuthSettings.builder()
      .tokenIssuer(issuer)
      .tokenSubject("foo")
      .tokenAudience("bar")
      .build();
  }

  public static class TestConfig {

    /**
     * Overrides the adminClient bean for test purposes to connect to our Connector container
     *
     * @return a ConnectorAdminClient that can speak to the test container connector
     */
    @Bean
    @Primary
    public ConnectorAdminClient adminClient() {
      return ConnectorAdminClient.construct(getInterledgerBaseUri(), template -> {
        template.header(AUTHORIZATION, "Basic " + ADMIN_AUTH_TOKEN);
      });
    }

    @Bean
    @Primary
    public ConnectorRoutesClient routesClient() {
      return ConnectorRoutesClient.construct(getInterledgerBaseUri(), template -> {
        template.header("Authorization", "Basic YWRtaW46cGFzc3dvcmQ=");
      });
    }
  }
}
