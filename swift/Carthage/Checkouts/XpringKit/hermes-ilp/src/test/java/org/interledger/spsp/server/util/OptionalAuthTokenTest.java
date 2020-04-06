package org.interledger.spsp.server.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.util.Optional;

public class OptionalAuthTokenTest {

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void ofString() {
    assertThat(OptionalAuthToken.of("foo bar")).isNotEmpty().get().isEqualTo("bar");
    assertThat(OptionalAuthToken.of("bar")).isNotEmpty().get().isEqualTo("bar");

    // to match method argument type
    String nullString = null;
    assertThat(OptionalAuthToken.of(nullString)).isEmpty();
  }

  @Test
  public void ofOptional() {
    assertThat(OptionalAuthToken.of(Optional.of("foo bar"))).isNotEmpty().get().isEqualTo("bar");
    assertThat(OptionalAuthToken.of(Optional.of("bar"))).isNotEmpty().get().isEqualTo("bar");
    assertThat(OptionalAuthToken.of(Optional.empty())).isEmpty();
  }

  @Test
  public void ofOptionalHatesNull() {
    expectedException.expect(NullPointerException.class);
    // to match method argument type
    Optional<String> nullOpt = null;
    OptionalAuthToken.of(nullOpt);
  }
}
