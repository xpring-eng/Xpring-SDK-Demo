package org.interledger.spsp.server.grpc.auth;

import com.google.common.net.HttpHeaders;
import io.grpc.Metadata;

public class IlpGrpcMetadataReaderImpl implements IlpGrpcMetadataReader {

  @Override
  public String authorization(Metadata metadata) {
    return metadata.get(Metadata.Key.of(HttpHeaders.AUTHORIZATION, Metadata.ASCII_STRING_MARSHALLER));
  }
}
