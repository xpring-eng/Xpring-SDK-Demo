# Contributing

Thanks for considering a contribution to [Xpring SDK](https://github.com/xpring-eng/xpring-sdk)!

We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the [XRP Ledger](https://xrpl.org) and [Interledger Protocol (ILP)](https://interledger.org/). We are happy to review your pull requests. To make the process as smooth as possible, please read this document and follow the stated guidelines.

## About This Library

<img src="architecture.png" alt="Architecture Diagram of Xpring SDK"/>

This is a TypeScript library that is compiled to an `npm` module, which provides common functionality for Xpring SDK across all languages.

This library is widely consumed, including by:
- [Language Specific Libraries in Xpring SDK](https://github.com/xpring-eng/xpring-sdk#client-side-libraries)
- Xpring SDK's Server Side Component

If you make a code change to this library, you are more than likely adding a new feature in one or more dependent libraries. Your [pull requests](#requirements-for-a-successful-pull-request) for all code changes should document how the new fields and functionality will be used.

## Requirements for a Successful Pull Request

Before being considered for review or merging, each pull request must:
- Pass continuous integration tests.
- Document how the new functionality will be used in client libraries.
- Be free of lint errors. Please run `eslint` before sending a pull request.
- Be [marked as drafts](https://github.blog/2019-02-14-introducing-draft-pull-requests/) until they are ready for review.
- Adhere to the [code of conduct](CODE_OF_CONDUCT.md) for this repository.

## Building The Library

The library should build and pass all tests.

```shell
# Clone repository
$ git clone https://github.com/xpring-eng/xpring-common-js.git
$ cd xpring-common-js

# Pull submodules
$ git submodule init
$ git submodule update

# Install Protocol Buffers
# OSX
$ brew install protobuf
# Linux
$ sudo apt install protobuf-compiler
# Otherwise, see: https://github.com/protocolbuffers/protobuf#protocol-compiler-installation

# Install gRPC Web
# OSX
$ curl -L https://github.com/grpc/grpc-web/releases/download/1.0.7/protoc-gen-grpc-web-1.0.7-darwin-x86_64 --output protoc-gen-grpc-web
$ sudo mv protoc-gen-grpc-web /usr/local/bin/
$ chmod +x /usr/local/bin/protoc-gen-grpc-web

# Linux
$ curl -L https://github.com/grpc/grpc-web/releases/download/1.0.7/protoc-gen-grpc-web-1.0.7-linux-x86_64 --output protoc-gen-grpc-web
$ sudo mv protoc-gen-grpc-web /usr/local/bin/
$ chmod +x /usr/local/bin/protoc-gen-grpc-web

# Install gRPC tools globally.
$ npm -g i nyc grpc-tools

# Install required modules.
$ npm i

# Run tests!
$ npm test
```
