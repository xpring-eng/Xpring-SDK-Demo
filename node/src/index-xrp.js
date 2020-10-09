const { Wallet, WalletFactory, XrplNetwork } = require("xpring-js")
const bip39 = require('bip39')
const addressCodec = require('ripple-address-codec')
var mnemonic = 'seed sock milk update focus rotate barely fade car face mechanic mercy'

// ORIGINAL
var entropy = bip39.mnemonicToEntropy(mnemonic);
console.log("entropy:")
console.log(entropy)

var seedB58 = addressCodec.encodeSeed(Buffer.from(entropy, 'hex'), 'secp256k1');
console.log("seedB58: ")
console.log(seedB58)

var seedBuffer = bip39.mnemonicToSeedSync(mnemonic)

var wallet = Wallet.generateWalletFromMnemonic(mnemonic, undefined, true);
var wallet2 = Wallet.generateHDWalletFromSeed(seedBuffer, undefined, true);
var wallet3 = Wallet.generateWalletFromSeed(seedB58)
console.log("*** HDWALLET FROM MNEMONIC - orig")
console.log(JSON.stringify(wallet))
console.log("*** HDWALLET FROM SEED Buffer - orig")
console.log(JSON.stringify(wallet2))
console.log("*** WALLET FROM B58 seed - orig")
console.log(JSON.stringify(wallet3))

/**
// USING WALLET
var mnemonic = 'seed sock milk update focus rotate barely fade car face mechanic mercy'
var seedBuffer = bip39.mnemonicToSeedSync(mnemonic)
var wallet = Wallet.generateWalletFromMnemonic(mnemonic);
var wallet2 = Wallet.generateHDWalletFromSeed(seedBuffer);
console.log("*** WALLET FROM MNEMONIC -- Wallet")
console.log(JSON.stringify(wallet))
console.log("*** WALLET FROM SEED -- Wallet")
console.log(JSON.stringify(wallet2))


// USING WALLET FACTORY
async function testWalletFactory() {
  var mnemonic =
  'seed sock milk update focus rotate barely fade car face mechanic mercy'
  var walletFactory = new WalletFactory(XrplNetwork.Test)
  var seedBuffer = bip39.mnemonicToSeedSync(mnemonic)
  var wallet = await walletFactory.walletFromMnemonicAndDerivationPath(
  mnemonic,
  )
  var wallet2 = walletFactory.walletFromSeedAndDerivationPath(
  seedBuffer.toString('hex'),
  )
  console.log('*** WALLET FROM MNEMONIC -- WalletFactory')
  console.log(JSON.stringify(wallet))
  console.log('*** WALLET FROM SEED -- WalletFactory')
  console.log(JSON.stringify(wallet2))
}

testWalletFactory().then(()=> {})
*/