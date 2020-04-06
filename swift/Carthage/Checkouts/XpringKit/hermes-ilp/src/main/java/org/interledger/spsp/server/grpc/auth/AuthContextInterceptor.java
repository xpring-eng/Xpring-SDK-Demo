package org.interledger.spsp.server.grpc.auth;

import io.grpc.Context;
import io.grpc.Contexts;
import io.grpc.Metadata;
import io.grpc.ServerCall;
import io.grpc.ServerCallHandler;
import io.grpc.ServerInterceptor;
import org.lognet.springboot.grpc.GRpcGlobalInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GRpcGlobalInterceptor
public class AuthContextInterceptor implements ServerInterceptor {

  private static final Logger LOGGER = LoggerFactory.getLogger(AuthContextInterceptor.class);

  private final IlpGrpcMetadataReader ilpGrpcMetadataReader;

  public AuthContextInterceptor(IlpGrpcMetadataReader ilpGrpcMetadataReader) {
    LOGGER.info("JwtContextInterceptor started for GRPC");
    this.ilpGrpcMetadataReader = ilpGrpcMetadataReader;
  }

  @Override
  public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> call,
                                                               Metadata headers,
                                                               ServerCallHandler<ReqT, RespT> next) {
    String authorization = ilpGrpcMetadataReader.authorization(headers);
    Context context = Context.current().withValue(IlpGrpcAuthConstants.AUTH_KEY, authorization);
    return Contexts.interceptCall(context, call, headers, next);
  }
}
