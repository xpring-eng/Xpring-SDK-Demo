package org.interledger.spsp.server.util;

import java.util.Objects;
import java.util.Optional;

public final class OptionalAuthToken {

  public static Optional<String> of(Optional<String> authToken) {
    Objects.requireNonNull(authToken);
    return authToken.map(t -> t.substring(t.indexOf(" ") + 1));
  }

  public static Optional<String> of(String authToken) {
    return of(Optional.ofNullable(authToken));
  }
}
