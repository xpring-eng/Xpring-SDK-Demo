import PaymentPointer from './payment-pointer'

/**
 * A static utility class for PayID.
 */
export default class PayIDUtils {
  /**
   * Parse a payment pointer string to a payment pointer object
   *
   * @param paymentPointer The input string payment pointer.
   * @returns A PaymentPointer object if the input was valid, otherwise undefined.
   */
  public static parsePaymentPointer(
    paymentPointer: string,
  ): PaymentPointer | undefined {
    // Input must be ascii only.
    if (!PayIDUtils.isASCII(paymentPointer)) return

    // Payment pointers must start with a '$'.
    if (!paymentPointer.startsWith('$')) return

    const address = paymentPointer.substring(1)
    const pathIndex = address.indexOf('/')

    // Host must not be empty.
    const host = pathIndex >= 0 ? address.substring(0, pathIndex) : address
    if (host === '') return

    if (pathIndex >= 0) {
      return new PaymentPointer(host, address.substring(pathIndex))
    }
    return new PaymentPointer(host)
  }

  /**
   * Validate if the input is ASCII based text.
   *
   * Shamelessly taken from:
   * https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
   *
   * @param input The input to check
   * @returns A boolean indicating the result.
   */
  private static isASCII(input: string): boolean {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(input)
  }

  /** Please do not instantiate this static utility class. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
