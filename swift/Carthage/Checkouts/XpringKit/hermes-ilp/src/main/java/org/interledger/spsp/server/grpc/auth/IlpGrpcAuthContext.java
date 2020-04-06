package org.interledger.spsp.server.grpc.auth;

public interface IlpGrpcAuthContext {

  String getAuthorizationHeader();

}
