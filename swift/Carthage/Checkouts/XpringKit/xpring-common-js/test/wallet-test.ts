import { assert } from 'chai'
import Wallet from '../src/wallet'
import 'mocha'

/**
 * A mapping of input and expected outputs for BIP39 and BIP44.
 * @see https://iancoleman.io/bip39/#english
 */
const derivationPathTestCases = {
  index0: {
    mnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    derivationPath: "m/44'/144'/0'/0/0",
    expectedPublicKey:
      '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE',
    expectedPrivateKey:
      '0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4',
    expectedMainNetAddress: 'XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ',
    expectedTestNetAddress: 'TVHLFWLKvbMv1LFzd6FA2Bf9MPpcy4mRto4VFAAxLuNpvdW',
    messageHex: Buffer.from('test message', 'utf-8').toString('hex'),
    expectedSignature:
      '3045022100E10177E86739A9C38B485B6AA04BF2B9AA00E79189A1132E7172B70F400ED1170220566BD64AA3F01DDE8D99DFFF0523D165E7DD2B9891ABDA1944E2F3A52CCCB83A',
  },
  index1: {
    mnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    derivationPath: "m/44'/144'/0'/0/1",
    expectedPublicKey:
      '038BF420B5271ADA2D7479358FF98A29954CF18DC25155184AEAD05796DA737E89',
    expectedPrivateKey:
      '000974B4CFE004A2E6C4364CBF3510A36A352796728D0861F6B555ED7E54A70389',
    expectedAddress: 'X7uRz9jfzHUFEjZTZ7rMVzFuTGZTHWcmkKjvGkNqVbfMhca',
  },
}

describe('wallet', function(): void {
  it('generateRandomWallet', function(): void {
    // WHEN a new wallet is generated for use on mainnet
    const walletGenerationResult = Wallet.generateRandomWallet()

    // THEN the wallet generation artifacts exist and have the default derivation path.
    assert.exists(walletGenerationResult!.wallet)
    assert.exists(walletGenerationResult!.mnemonic)
    assert.equal(
      walletGenerationResult!.derivationPath,
      Wallet.getDefaultDerivationPath(),
    )
  })

  it('generateRandomWallet - entropy and mainnet', function(): void {
    // WHEN a new wallet is generated with entropy on MainNet.
    const walletGenerationResult = Wallet.generateRandomWallet(
      '00000000000000000000000000000000',
    )

    // THEN the result exists and has the default derivation path.
    assert.exists(walletGenerationResult)
    assert.equal(
      walletGenerationResult!.mnemonic,
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    )
    assert.equal(
      walletGenerationResult!.derivationPath,
      Wallet.getDefaultDerivationPath(),
    )
    assert.equal(
      walletGenerationResult!.wallet.getAddress(),
      'XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ',
    )
  })

  it('generateRandomWallet - entropy and testnet', function(): void {
    // WHEN a new wallet is generated with entropy on TestNet
    const walletGenerationResult = Wallet.generateRandomWallet(
      '00000000000000000000000000000000',
      true,
    )

    // THEN the result exists and has the default derivation path.
    assert.exists(walletGenerationResult)
    assert.equal(
      walletGenerationResult!.mnemonic,
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    )
    assert.equal(
      walletGenerationResult!.derivationPath,
      Wallet.getDefaultDerivationPath(),
    )
    assert.equal(
      walletGenerationResult!.wallet.getAddress(),
      'TVHLFWLKvbMv1LFzd6FA2Bf9MPpcy4mRto4VFAAxLuNpvdW',
    )
  })

  it('generateRandomWallet - invalid entropy', function(): void {
    // WHEN a new wallet is generated with invalid hexadecimal entropy.
    const walletGenerationResult = Wallet.generateRandomWallet('xrp')

    // THEN the result exists and has the default derivation path.
    assert.isUndefined(walletGenerationResult)
  })

  it('walletFromMnemonic - derivation path index 0 - MainNet', function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index0

    // WHEN a new wallet is generated on MainNet with the mnemonic and derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey)
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey)
    assert.equal(wallet.getAddress(), testData.expectedMainNetAddress)
  })

  it('walletFromMnemonic - derivation path index 0, TestNet', function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index0

    // WHEN a new wallet is generated on TestNet with the mnemonic and derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
      true,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey)
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey)
    assert.equal(wallet.getAddress(), testData.expectedTestNetAddress)
  })

  it('walletFromMnemonic - derivation path index 1', function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index1

    // WHEN a new wallet is generated with the mnemonic and derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey)
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey)
    assert.equal(wallet.getAddress(), testData.expectedAddress)
  })

  it('walletFromMnemonic - no derivation path', function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index0

    // WHEN a new wallet is generated with the mnemonic and an unspecified derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic)!

    // THEN the wallet has the expected address and keys from the input mnemonic at the default derivation path.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey)
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey)
    assert.equal(wallet.getAddress(), testData.expectedMainNetAddress)
  })

  it('walletFromMnemonic - invalid mnemonic', function(): void {
    // GIVEN an invalid mnemonic.
    const mnemonic = 'xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr'

    // WHEN a wallet is generated from the mnemonic.
    const wallet = Wallet.generateWalletFromMnemonic(mnemonic)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('walletFromSeed - MainNet', function(): void {
    // GIVEN a seed used to generate a wallet on MainNet
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'
    const isTestNet = false

    // WHEN a wallet is generated from the seed.
    const wallet = Wallet.generateWalletFromSeed(seed, isTestNet)

    // THEN the wallet has the expected address.
    assert.equal(
      wallet!.getAddress(),
      'XVnJMYQFqA8EAijpKh5EdjEY5JqyxykMKKSbrUX8uchF6U8',
    )
  })

  it('walletFromSeed - TestNet', function(): void {
    // GIVEN a seed used to generate a wallet on TestNet
    const seed = 'snYP7oArxKepd3GPDcrjMsJYiJeJB'
    const test = true

    // WHEN a wallet is generated from the seed.
    const wallet = Wallet.generateWalletFromSeed(seed, test)

    // THEN the wallet has the expected address.
    assert.equal(
      wallet!.getAddress(),
      'T7zFmeZo6uLHP4Vd21TpXjrTBk487ZQPGVQsJ1mKWGCD5rq',
    )
  })

  it('walletFromSeed - invalid seed', function(): void {
    // GIVEN an invalid seed.
    const seed = 'xrp'

    // WHEN a wallet is generated from the seed.
    const wallet = Wallet.generateWalletFromSeed(seed)

    // THEN the wallet is undefined.
    assert.isUndefined(wallet)
  })

  it('sign', function(): void {
    // GIVEN a wallet.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!

    // WHEN the wallet signs a hex message.
    const signature = wallet.sign(testData.messageHex)

    // THEN the signature is as expected.
    assert.equal(signature, testData.expectedSignature)
  })

  it('sign - invalid hex', function(): void {
    // GIVEN a wallet and a non-hexadecimal message.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = 'xrp'

    // WHEN the wallet signs a message.
    const signature = wallet.sign(message)

    // THEN the signature is undefined.
    assert.notExists(signature)
  })

  it('verify - valid signature', function(): void {
    // GIVEN a wallet and a message with a valid signature.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = testData.messageHex
    const signature = testData.expectedSignature

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed valid.
    assert.isTrue(isValid)
  })

  it('verify - invalid signature', function(): void {
    // GIVEN a wallet and a invalid signature.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = testData.messageHex
    const signature = 'DEADBEEF'

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid)
  })

  it('verify - bad signature', function(): void {
    // GIVEN a wallet and a non hex signature.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = testData.messageHex
    const signature = 'xrp'

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid)
  })

  it('verify - bad message', function(): void {
    // GIVEN a wallet and a non hex message.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = 'xrp'
    const signature = testData.expectedSignature

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid)
  })

  it('signs and verifies an empty message', function(): void {
    // GIVEN a wallet and an empty message.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = ''

    // WHEN the message is verified.
    const signature = wallet.sign(message)!
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed valid.
    assert.isTrue(isValid)
  })

  it('fails to verify a bad signature on an empty string.', function(): void {
    // GIVEN a wallet and an empty message and an incorrect signature.
    const testData = derivationPathTestCases.index0
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath,
    )!
    const message = ''
    const signature = 'DEADBEEF'

    // WHEN the message is verified.
    const isValid = wallet.verify(message, signature)

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid)
  })
})
