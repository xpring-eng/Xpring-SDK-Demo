package org.interledger.spsp.server.grpc.auth;

import io.grpc.Context;

public final class IlpGrpcAuthConstants {
  public static final Context.Key AUTH_KEY = Context.key("ILP_AUTH");
}
