# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.2] - 2019-02-28

### Fixed
- Webpack wasn't being run.

### Added
- Added transaction exports.

## [3.0.1] - 2019-02-27

This release fixes the empty typescript type definition exports.

### Fixed
- Build and Webpack output now include the generated protobuf typescript type definintions.

## [3.0.0] - 2019-02-24

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. The `Signer`'s `signTransaction` method previously returned a hex string representing the signature of the transaction. After this change, it returns the entire signed and encoded transaction as a byte array. This encapsulates the serialization and signing logic inside of this library, rather than forcing clients to understand it. This is a breaking change (See 'Breaking Changes') below. 

This release also changes the protocol buffer compiler used to generate protocol buffers in order to make this library function inside of a browser environment. As part of this change, various optimizations to TypeScript and webpack compilation are also produced (see 'Breaking Changes') below. 

### Breaking Changes
- Modify `Signer`'s `signTransaction` method to return an array of signed bytes rather than a string based signature.
- Changed webpack EntryPoint to XpringCommonJS.
- Changed webpack output file from bundled.js to index.js.

### Added
- Added compatability for the library to be usable on the web and Node.js without having two separate codebases or build strategies by switching to using gRPC-Web instead of the Node.js version of gRPC.

### Fixed
- Updated webpack configuration to use UMD (Universal module definitions) to support both web and Node.js.

### Internal Changes
- Updated the ESLint and TSConfig to properly lint the project to our preferred styles.

## [2.0.1] - 2019-02-15

### Fixed

This patch release locks the versions of `grpc-tools` and `grpc_tools_node_protoc_ts` dependencies. This allows client projects to be able to deterministicly generate compatible protocol buffers with this project's TypeScript. 

Previously, different versions of the protocol buffer compiler would (sometimes) produce slightly different output (generally by renaming fields).

## [2.0.0] - 2019-02-15

### Added

The release migrates the protocol buffers in (xpring-common-protocol-buffers)[https://github.com/xpring-eng/xpring-common-protocol-buffers) to a 'legacy' namespace. These protocol buffers and methods will be removed at some point in the future.

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. These protocol buffers are the recommended alternative.

The protocol buffers from `rippled` are not compatible with the protocol buffers from `xpring-common-protocol-buffers`. That makes this a *breaking change*. Clients will need to migrate to new methods (see `breaking changes` below).

- Support for rippled protocol buffer serialization and signing.
- `Serializer`'s `transactionToJSON` method is renamed `legacyTransactionToJSON`. The `transactionToJSON` method now supports protocol buffers from rippled.
- `Signers`'s `signTransaction` method is renamed to `signLegacyTransaction`. The `signTransaction` method now supports protocol buffers from rippled.

### Breaking Changes

- Clients who called `Serializer`'s `transactionToJSON` should migrate to using the `legacyTransactionToJSON` method.
- Clients who called `Signers`'s `signTransaction` should migrate to using the `signLegacyTransaction` method.
