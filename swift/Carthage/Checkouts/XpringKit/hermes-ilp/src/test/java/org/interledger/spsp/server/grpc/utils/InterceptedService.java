package org.interledger.spsp.server.grpc.utils;

import org.interledger.spsp.server.grpc.auth.AuthContextInterceptor;
import org.interledger.spsp.server.grpc.auth.IlpGrpcMetadataReader;

import io.grpc.BindableService;
import io.grpc.ServerInterceptors;
import io.grpc.ServerServiceDefinition;

public final class InterceptedService {

  public static ServerServiceDefinition of(BindableService service, IlpGrpcMetadataReader reader) {
    return ServerInterceptors.intercept(service, new AuthContextInterceptor(reader));
  }
}
