package org.interledger.spsp.server.grpc.auth;

import io.grpc.Metadata;

public interface IlpGrpcMetadataReader {

  String authorization(Metadata metadata);
}
