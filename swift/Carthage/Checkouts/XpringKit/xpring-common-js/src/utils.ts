import { createHash } from 'crypto'
import * as addressCodec from 'ripple-address-codec'

/**
 * A prefex applied when hashing a signed transaction blob.
 *
 * @see https://xrpl.org/basic-data-types.html#hashes
 */
const signedTransactionPrefixHex = '54584E00'

/**
 * A simple property bag which contains components of a classic address. Components contained in this object are neither sanitized or validated.
 */
export interface ClassicAddress {
  /** A classic address. */
  address: string

  /** An optional tag. */
  tag?: number

  /** A boolean indicating whether this address is for use on a test network. */
  test: boolean
}

class Utils {
  /**
   * Validate that the given string is a valid address for the XRP Ledger.
   *
   * This function returns true for both X-addresses and classic addresses.
   * @see https://xrpaddress.info/
   *
   * @param address An address to check.
   * @returns True if the address is valid, otherwise false.
   */
  public static isValidAddress(address: string): boolean {
    return (
      addressCodec.isValidClassicAddress(address) ||
      addressCodec.isValidXAddress(address)
    )
  }

  /**
   * Validate whether the given string is a valid X-address for the XRP Ledger.
   *
   * @see https://xrpaddress.info/
   *
   * @param address An address to check.
   * @returns True if the address is a valid X-address, otherwise false.
   */
  public static isValidXAddress(address: string): boolean {
    return addressCodec.isValidXAddress(address)
  }

  /**
   * Validate whether the given string is a valid classic address for the XRP Ledger.
   *
   * @see https://xrpaddress.info/
   *
   * @param address An address to check.
   * @returns True if the address is a valid classic address, otherwise false.
   */
  public static isValidClassicAddress(address: string): boolean {
    return addressCodec.isValidClassicAddress(address)
  }

  /**
   * Encode the given classic address and tag into an x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @param classicAddress A classic address to encode.
   * @param tag An optional tag to encode.
   * @param test Whether the address is for use on a test network, defaults to `false`.
   * @returns A new x-address if inputs were valid, otherwise undefined.
   */
  public static encodeXAddress(
    classicAddress: string,
    tag: number | undefined,
    test = false,
  ): string | undefined {
    if (!addressCodec.isValidClassicAddress(classicAddress)) {
      return undefined
    }

    // Xpring Common JS's API takes a string|undefined while the underlying address library wants string|false.
    const shimTagParameter = tag !== undefined ? tag : false
    return addressCodec.classicAddressToXAddress(
      classicAddress,
      shimTagParameter,
      test,
    )
  }

  /**
   * Decode a `ClassicAddress` from a given x-address.
   *
   * @see https://xrpaddress.info/
   *
   * @param xAddress The xAddress to decode.
   * @returns A `ClassicAddress`
   */
  public static decodeXAddress(xAddress: string): ClassicAddress | undefined {
    if (!addressCodec.isValidXAddress(xAddress)) {
      return undefined
    }

    const shimClassicAddress = addressCodec.xAddressToClassicAddress(xAddress)
    return {
      address: shimClassicAddress.classicAddress,
      tag:
        shimClassicAddress.tag !== false ? shimClassicAddress.tag : undefined,
      test: shimClassicAddress.test,
    }
  }

  /**
   * Convert the given byte array to a hexadecimal string.
   *
   * @param bytes An array of bytes
   * @returns An encoded hexadecimal string.
   */
  public static toHex(bytes: Uint8Array): string {
    return Buffer.from(bytes)
      .toString('hex')
      .toUpperCase()
  }

  /**
   * Convert the given hexadecimal string to a byte array.
   *
   * @param hex A hexadecimal string.
   * @returns A decoded byte array.
   */
  public static toBytes(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, 'hex'))
  }

  /**
   * Convert the given transaction blob to a transaction hash.
   *
   * @param transactionBlobHex A hexadecimal encoded transaction blob.
   * @returns A hex encoded hash if the input was valid, otherwise undefined.
   */
  public static transactionBlobToTransactionHash(
    transactionBlobHex: string,
  ): string | undefined {
    if (!Utils.isHex(transactionBlobHex)) {
      return undefined
    }

    const prefixedTransactionBlob = this.toBytes(
      signedTransactionPrefixHex + transactionBlobHex,
    )
    const hash = this.sha512Half(prefixedTransactionBlob)
    return this.toHex(hash)
  }

  /**
   * Compute the SHA512 half hash of the given bytes.
   *
   * @param input The input to hash.
   * @returns The hash of the input.
   */
  private static sha512Half(bytes: Uint8Array): Uint8Array {
    const sha512 = createHash('sha512')
    const hashHex = sha512
      .update(bytes)
      .digest('hex')
      .toUpperCase()
    const hash = this.toBytes(hashHex)

    return hash.slice(0, 32)
  }

  /**
   * Check if the given string is valid hex.
   *
   * @param input The input to check.
   * @returns true if the input is valid hex, otherwise false.
   */
  public static isHex(input: string): boolean {
    const hexRegEx = /([0-9]|[a-f])/gim
    return (input.match(hexRegEx) || []).length === input.length
  }
}

export default Utils
