# Xpring-SDK-Demo

Demos for each library in [Xpring SDK](http://github.com/xpring-sdk):
- [JavaScript / Xpring-JS](http://github.com/xpring-eng/xpring-js): `node/` 
- [Java / Xpring4J](http://github.com/xpring-eng/xpring4j): `java/`
- [Swift / XpringKit](http://github.com/xpring-eng/xpringkit): `swift/`

Build instructions included in each folder.

Each XRP demo:
- Restores a [TestNet wallet](http://testnet.xrpl.org) from a seed
- Retrieves the balance of that wallet
- Sends a payment transaction
- Checks the status of that transaction

Each ILP Demo (node and Java only)
- Retrieves the balance of `demo_user`
- Sends an XRP over ILP payment from `demo_user` to `demo_receiver`
- Retrieves the balance of `demo_user` after the payment is sent

