/**
 * A class which which encapsulates components of a Payment Pointer.
 *
 * See: https://paymentpointers.org/syntax-resolution/
 */
export default class PaymentPointer {
  /** The well known path. */
  public static WELL_KNOWN_PATH = '/.well-known/pay'

  /** The host of the payment pointer. */
  public readonly host: string

  /** The path of the payment pointer. */
  public readonly path: string

  /**
   * Create a new PaymentPointer.
   *
   * If the path is given as undefined or `/` the well known path is created.
   *
   * @param host The host of the payment pointer.
   * @param path The path of the payment pointer.
   */
  public constructor(host: string, path?: string | undefined) {
    this.host = host

    // An empty path of '/' path defaults to a WELL_KNOWN path.
    const normalizedPath = path || PaymentPointer.WELL_KNOWN_PATH
    this.path =
      normalizedPath === '/' ? PaymentPointer.WELL_KNOWN_PATH : normalizedPath
  }
}
