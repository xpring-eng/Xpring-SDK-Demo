import { assert } from 'chai'
import * as rippleCodec from 'ripple-binary-codec'
import FakeWallet from './fakes/fake-wallet'
import { Payment as LegacyPayment } from '../src/generated/legacy/payment_pb'
import Signer from '../src/signer'
import { Transaction as LegacyTransaction } from '../src/generated/legacy/transaction_pb'
import { XRPAmount } from '../src/generated/legacy/xrp_amount_pb'
import 'mocha'
import {
  AccountAddress,
  CurrencyAmount,
  XRPDropsAmount,
} from '../src/generated/rpc/v1/amount_pb'
import { Payment, Transaction } from '../src/generated/rpc/v1/transaction_pb'
import Utils from '../src/utils'
import Serializer from '../src/serializer'

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('signer', function(): void {
  it('sign legacy transaction', function(): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = 'DEADBEEF'
    const wallet = new FakeWallet(fakeSignature)

    const value = '1000'
    const destination = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
    const fee = '10'
    const sequence = 1
    const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'

    const paymentAmount = new XRPAmount()
    paymentAmount.setDrops(value)

    const payment = new LegacyPayment()
    payment.setDestination(destination)
    payment.setXrpAmount(paymentAmount)

    const transactionFee = new XRPAmount()
    transactionFee.setDrops(fee)

    const transaction = new LegacyTransaction()
    transaction.setAccount(account)
    transaction.setFee(transactionFee)
    transaction.setSequence(sequence)
    transaction.setPayment(payment)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signLegacyTransaction(transaction, wallet)

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)

    assert.isTrue(Utils.isHex(signedTransaction!.getTransactionSignatureHex()))

    assert.equal(signedTransaction!.getTransactionSignatureHex(), fakeSignature)

    assert.deepEqual(
      signedTransaction!.getTransaction()!.toObject(),
      transaction.toObject(),
    )
  })

  it('sign', function(): void {
    // GIVEN an transaction and a wallet and expected signing artifacts.
    const fakeSignature = 'DEADBEEF'
    const wallet = new FakeWallet(fakeSignature)

    const value = 1000
    const destination = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
    const fee = 10
    const sequence = 1
    const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'

    const paymentAmount = new XRPDropsAmount()
    paymentAmount.setDrops(value)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(paymentAmount)

    const destinationAddress = new AccountAddress()
    destinationAddress.setAddress(destination)

    const payment = new Payment()
    payment.setDestination(destinationAddress)
    payment.setAmount(currencyAmount)

    const transactionFee = new XRPDropsAmount()
    transactionFee.setDrops(fee)

    const sender = new AccountAddress()
    sender.setAddress(account)

    const transaction = new Transaction()
    transaction.setAccount(sender)
    transaction.setFee(transactionFee)
    transaction.setSequence(sequence)
    transaction.setPayment(payment)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      transaction,
      fakeSignature,
    )
    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(transaction, wallet)

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })
})
