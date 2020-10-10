const { Wallet } = require("xpring-js")
const bip39 = require('bip39')
const addressCodec = require('ripple-address-codec')

var mnemonic = 'seed sock milk update focus rotate barely fade car face mechanic mercy'

// 32 char hex string = 128 bits https://github.com/bitcoinjs/bip39/blob/master/src/index.js
var entropy = bip39.mnemonicToEntropy(mnemonic);
console.log("entropy length and entropy: " + entropy.length)
console.log(entropy)

// 16 byte array = 128 bits
var entropyBuffer = Buffer.from(entropy, 'hex')
console.log("entropy buffer length and buffer: " + entropyBuffer.length)
console.log(entropyBuffer)

// base 58 encoded string seed
var seedB58 = addressCodec.encodeSeed(entropyBuffer, 'secp256k1');
console.log("seed B58: ")
console.log(seedB58)

// 64 byte array - unclear what to do with this
var seedBuffer = bip39.mnemonicToSeedSync(mnemonic)
console.log("seedBuffer Length + seedBuffer vv: " + seedBuffer.length)
console.log(seedBuffer)

// object with several fields, including 16-byte array 'bytes' 
// 'bytes' buffer is SAME AS ENTROPY BUFFER
var decodedSeed = addressCodec.decodeSeed(seedB58)
console.log("decodedSeed length + decodedSeed vv: " + decodedSeed.bytes.length)
console.log(decodedSeed)

// original word string
var decodedMnemonic = bip39.entropyToMnemonic(decodedSeed.bytes)
console.log("decodedMnemonic length + decodedMnemonic: " + decodedMnemonic.length)
console.log(decodedMnemonic)

var wallet = Wallet.generateWalletFromMnemonic(mnemonic, undefined, true);
var wallet2 = Wallet.generateHDWalletFromSeed(seedBuffer, undefined, true);
var wallet3 = Wallet.generateWalletFromMnemonic(decodedMnemonic, undefined, true)
var wallet4 = Wallet.generateWalletFromSeed(seedB58)
console.log("*** HDWALLET FROM MNEMONIC - original")
console.log(JSON.stringify(wallet))
console.log("*** HDWALLET FROM SEED BUFFER")
console.log(JSON.stringify(wallet2))
console.log("*** WALLET FROM DECODED MNEMONIC")
console.log(JSON.stringify(wallet3))
console.log("***WALLET FROM SEED - not HD")
console.log(JSON.stringify(wallet4))
