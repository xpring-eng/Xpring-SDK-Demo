[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/xpring-common-js/master?style=flat-square&token=0ed9e0790d44d163a5bf2793724fc85d98c3845b)](https://circleci.com/gh/xpring-eng/xpring-common-js/tree/master) [![CodeCov](https://img.shields.io/codecov/c/github/xpring-eng/xpring-common-js/master?style=flat-square&token=08b799e2895a4dd6add40c4621880c1a)]((https://codecov.io/gh/xpring-eng/xpring-common-js))
[![Dependabot Status](https://img.shields.io/static/v1?label=Dependabot&message=enabled&color=success&style=flat-square&logo=dependabot)](https://dependabot.com)

# Xpring Common JavaScript

Xpring Common JavaScript Library provides common JavaScript functionality to all client side libraries in [Xpring SDK](https://github.com/xpring-eng/xpring-sdk). This library is built to be consumed as a dependency to other libraries, rather than a standalone library.

Developers probably want to use one of the language specific libraries for [Xpring SDK](https://github.com/xpring-eng/xpring-sdk#client-side-libraries), rather than consuming this library directly. However, developers with specific requirements for interacting with Xpring SDK may want to depend on this library.

## Overview
Xpring Common JavaScript is composed of several classes:
- `Wallet`:  Provides key management, address derivation, and signing / verify functionality.
- `Signer`: Provides utility functions for signing transactions.
- `Serializer`: Provides functionality for serializing Xpring Common JavaScript model objects for signing.
- `Utils`: Provides common utility functions.

# Contributing

Pull requests are welcome! To get started with building this library and opening pull requests, please see [contributing.md](CONTRIBUTING.md).

Thank you to all the users who have contributed to this library!

<a href="https://github.com/xpring-eng/xpring-common-js/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=xpring-eng/xpring-common-js" />
</a>

# License

Xpring SDK is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
