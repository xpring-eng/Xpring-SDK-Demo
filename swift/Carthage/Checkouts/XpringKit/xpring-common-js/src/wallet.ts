import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as rippleKeyPair from 'ripple-keypairs'
import Utils from './utils'

/**
 * The default derivation path to use with BIP44.
 */
const defaultDerivationPath = "m/44'/144'/0'/0/0"

/**
 * An object which contains artifacts from generating a new wallet.
 */
export interface WalletGenerationResult {
  /** The newly generated Wallet. */
  wallet: Wallet

  /** The mnemonic used to generate the wallet. */
  mnemonic: string

  /** The derivation path used to generate the wallet. */
  derivationPath: string
}

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
  /**
   * @returns {String} The default derivation path.
   */
  public static getDefaultDerivationPath(): string {
    return defaultDerivationPath
  }

  /**
   * Generate a new wallet hierarchical deterministic wallet with a random mnemonic and
   * default derivation path.
   *
   * Secure random number generation is used when entropy is ommitted and when the runtime environment has the necessary support. Otherwise, an error is thrown. Runtime environments that do not have secure random number generation should pass their own buffer of entropy.
   *
   * @param entropy A optional hex string of entropy.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   * @returns Artifacts from the wallet generation.
   */
  public static generateRandomWallet(
    entropy: string | undefined = undefined,
    test = false,
  ): WalletGenerationResult | undefined {
    if (entropy && !Utils.isHex(entropy)) {
      return undefined
    }

    const mnemonic =
      entropy === undefined
        ? bip39.generateMnemonic()
        : bip39.entropyToMnemonic(entropy)
    const derivationPath = Wallet.getDefaultDerivationPath()
    const wallet = Wallet.generateWalletFromMnemonic(
      mnemonic,
      derivationPath,
      test,
    )
    return wallet === undefined
      ? undefined
      : { wallet, mnemonic, derivationPath }
  }

  /**
   * Generate a new hierarchical deterministic wallet from a mnemonic and derivation path.
   *
   * @param mnemonic The given mnemonic for the wallet.
   * @param derivationPath The given derivation path to use. If undefined, the default path is used.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public static generateWalletFromMnemonic(
    mnemonic: string,
    derivationPath = Wallet.getDefaultDerivationPath(),
    test = false,
  ): Wallet | undefined {
    // Validate mnemonic and path are valid.
    if (!bip39.validateMnemonic(mnemonic)) {
      return undefined
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic)
    return Wallet.generateHDWalletFromSeed(seed, derivationPath, test)
  }

  /**
   * Generate a new hierarchical deterministic wallet from a seed and derivation path.
   *
   * @param seed The given seed for the wallet.
   * @param derivationPath The given derivation path to use. If undefined, the default path is used.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public static generateHDWalletFromSeed(
    seed: Buffer,
    derivationPath = Wallet.getDefaultDerivationPath(),
    test = false,
  ): Wallet | undefined {
    const masterNode = bip32.fromSeed(seed)
    const node = masterNode.derivePath(derivationPath)
    if (node.privateKey === undefined) return

    const publicKey = Wallet.hexFromBuffer(node.publicKey)
    const privateKey = Wallet.hexFromBuffer(node.privateKey)
    return new Wallet(publicKey, `00${privateKey}`, test)
  }

  /**
   * Generate a new wallet from the given seed.
   *
   * @param seed The given seed for the wallet.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given seed, or undefined if the seed was invalid.
   */
  public static generateWalletFromSeed(
    seed: string,
    test = false,
  ): Wallet | undefined {
    try {
      const keyPair = rippleKeyPair.deriveKeypair(seed)
      return new Wallet(keyPair.publicKey, keyPair.privateKey, test)
    } catch (exception) {
      return undefined
    }
  }

  /**
   * Create a new Wallet object.
   *
   * @param publicKey The given public key for the wallet.
   * @param privateKey The given private key for the wallet.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   */
  public constructor(
    private readonly publicKey: string,
    private readonly privateKey: string,
    private readonly test: boolean = false,
  ) {}

  /**
   * @returns {String} A string representing the public key for the wallet.
   */
  public getPublicKey(): string {
    return this.publicKey
  }

  /**
   * @returns {String} A string representing the private key for the wallet.
   */
  public getPrivateKey(): string {
    return this.privateKey
  }

  /**
   * @returns {String} A string representing the address of the wallet.
   */
  public getAddress(): string {
    const classicAddress = rippleKeyPair.deriveAddress(this.getPublicKey())
    const xAddress = Utils.encodeXAddress(classicAddress, undefined, this.test)
    if (xAddress === undefined) {
      throw new Error('Unknown error deriving address')
    }
    return xAddress
  }

  /**
   * Sign an arbitrary hex string.
   *
   * @param {String} hex An arbitrary hex string to sign.
   * @returns {String} A signature in hexadecimal format if the input was valid, otherwise undefined.
   */
  public sign(hex: string): string | undefined {
    if (!Utils.isHex(hex)) {
      return undefined
    }
    return rippleKeyPair.sign(hex, this.getPrivateKey())
  }

  /**
   * Verify a signature is valid for a message.
   *
   * @param {String} message A message in hex format.
   * @param {String} signature A signature in hex format.
   * @returns {Boolean} True if the signature is valid, otherwise false.
   */
  public verify(message: string, signature: string): boolean {
    if (!Utils.isHex(signature) || !Utils.isHex(message)) {
      return false
    }

    try {
      return rippleKeyPair.verify(message, signature, this.getPublicKey())
    } catch (error) {
      // The ripple-key-pair module may throw errors for some signatures rather than returning false.
      // If an error was thrown then the signature is definitely not valid.
      return false
    }
  }

  private static hexFromBuffer(buffer: Buffer): string {
    return buffer.toString('hex').toUpperCase()
  }
}

export default Wallet
