package org.interledger.spsp.server.grpc.auth;

import io.grpc.Context;

public class IlpGrpcAuthContextImpl implements IlpGrpcAuthContext {

  @Override
  public String getAuthorizationHeader() {
    return (String) IlpGrpcAuthConstants.AUTH_KEY.get(Context.current());
  }

}
