import { assert } from 'chai'
import PayIDUtils from '../../src/PayID/pay-id-utils'
import 'mocha'
import PaymentPointer from '../../src/PayID/payment-pointer'

describe('PayIDUtils', function(): void {
  it('parse payment pointer - host and path', function(): void {
    // GIVEN a payment pointer with a host and a path.
    const rawPaymentPointer = '$example.com/foo'

    // WHEN it is parsed to a PaymentPointer object
    const paymentPointer = PayIDUtils.parsePaymentPointer(rawPaymentPointer)

    // THEN the host and path are set correctly.
    assert.equal(paymentPointer?.host, 'example.com')
    assert.equal(paymentPointer?.path, '/foo')
  })

  it('parse payment pointer - well known path', function(): void {
    // GIVEN a payment pointer with a well known path.
    const rawPaymentPointer = '$example.com'

    // WHEN it is parsed to a PaymentPointer object
    const paymentPointer = PayIDUtils.parsePaymentPointer(rawPaymentPointer)

    // THEN the host and path are set correctly.
    assert.equal(paymentPointer?.host, 'example.com')
    assert.equal(paymentPointer?.path, PaymentPointer.WELL_KNOWN_PATH)
  })

  it('parse payment pointer - well known path trailing slash', function(): void {
    // GIVEN a payment pointer with a well known path and a trailing slash.
    const rawPaymentPointer = '$example.com/'

    // WHEN it is parsed to a PaymentPointer object
    const paymentPointer = PayIDUtils.parsePaymentPointer(rawPaymentPointer)

    // THEN the host and path are set correctly.
    assert.equal(paymentPointer?.host, 'example.com')
    assert.equal(paymentPointer?.path, PaymentPointer.WELL_KNOWN_PATH)
  })

  it('parse payment pointer - incorrect prefix', function(): void {
    // GIVEN a payment pointer without a '$' prefix
    const rawPaymentPointer = 'example.com/'

    // WHEN it is parsed to a PaymentPointer object THEN the result is undefined
    assert.isUndefined(PayIDUtils.parsePaymentPointer(rawPaymentPointer))
  })

  it('parse payment pointer - empty host', function(): void {
    // GIVEN a payment pointer without a host.
    const rawPaymentPointer = '$'

    // WHEN it is parsed to a PaymentPointer object THEN the result is undefined
    assert.isUndefined(PayIDUtils.parsePaymentPointer(rawPaymentPointer))
  })

  it('parse payment pointer - non-ascii characters', function(): void {
    // GIVEN a payment pointer with non-ascii characters.
    const rawPaymentPointer = '$ZA̡͊͠͝LGΌ IS̯͈͕̹̘̱ͮ TO͇̹̺ͅƝ̴ȳ̳ TH̘Ë͖́̉ ͠P̯͍̭O̚N̐Y̡'

    // WHEN it is parsed to a PaymentPointer object THEN the result is undefined
    assert.isUndefined(PayIDUtils.parsePaymentPointer(rawPaymentPointer))
  })
})
