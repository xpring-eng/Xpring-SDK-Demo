import { assert } from 'chai'
import { Payment as LegacyPayment } from '../src/generated/legacy/payment_pb'
import Serializer from '../src/serializer'
import { Transaction as LegacyTransaction } from '../src/generated/legacy/transaction_pb'
import { AccountAddress } from '../src/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from '../src/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Payment,
  Transaction,
} from '../src/generated/org/xrpl/rpc/v1/transaction_pb'
import { XRPAmount } from '../src/generated/legacy/xrp_amount_pb'
import 'mocha'
import Utils from '../src/utils'
import {
  Destination,
  Amount,
  Sequence,
  SigningPublicKey,
  Account,
} from '../src/generated/org/xrpl/rpc/v1/common_pb'

/** Constants for transactions */
const value = '1000'
const destinationClassicAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const destinationXAddressWithoutTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const destinationXAddressWithTag =
  'XVPcpSm47b1CZkf5AkKM9a84dQHe3mTAxgxfLw2qYoe7Boa'
const tag = 12345
const sequence = 1
const lastLedgerSequence = 20
const publicKey =
  '031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE'
const fee = '10'
const accountClassicAddress = 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ'
const accountXAddress = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'

/**
 * Create a new `Transaction` object with the given inputs.
 *
 * @param value The amount of XRP to send, in drops.
 * @param destination The destination address.
 * @param fee The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequence The last ledger sequence the transaction will be valid in.
 * @param sequence The sequence number for the sending account.
 * @param account The address of the sending account.
 * @param publicKey The public key of the sending account, encoded as a hexadecimal string.
 */
function makeTransaction(
  value: string,
  destinationAddress: string,
  fee: string,
  lastLedgerSequenceNumber: number,
  sequenceNumber: number,
  senderAddress: string | undefined,
  publicKey: string,
): Transaction {
  const paymentAmount = new XRPDropsAmount()
  paymentAmount.setDrops(value)

  const currencyAmount = new CurrencyAmount()
  currencyAmount.setXrpAmount(paymentAmount)

  const amount = new Amount()
  amount.setValue(currencyAmount)

  const destinationAccountAddress = new AccountAddress()
  destinationAccountAddress.setAddress(destinationAddress)

  const destination = new Destination()
  destination.setValue(destinationAccountAddress)

  const payment = new Payment()
  payment.setDestination(destination)
  payment.setAmount(amount)

  const transactionFee = new XRPDropsAmount()
  transactionFee.setDrops(fee)

  const sequence = new Sequence()
  sequence.setValue(sequenceNumber)

  const lastLedgerSequence = new Sequence()
  lastLedgerSequence.setValue(lastLedgerSequenceNumber)

  const signingPublicKey = new SigningPublicKey()
  signingPublicKey.setValue(Utils.toBytes(publicKey))

  const transaction = new Transaction()
  transaction.setFee(transactionFee)
  transaction.setSequence(sequence)
  transaction.setPayment(payment)
  transaction.setSigningPublicKey(signingPublicKey)
  transaction.setLastLedgerSequence(lastLedgerSequence)

  // Account is an optional input so that malformed transaction serialization can be tested.
  if (senderAddress) {
    const senderAccountAddress = new AccountAddress()
    senderAccountAddress.setAddress(senderAddress)

    const senderAccount = new Account()
    senderAccount.setValue(senderAccountAddress)

    transaction.setAccount(senderAccount)
  }

  return transaction
}

/**
 * Create a new `LegacyTransaction` object with the given inputs.
 *
 * @param value The amount of XRP to send, in drops.
 * @param destination The destination address.
 * @param fee The amount of XRP to use as a fee, in drops.
 * @param lastLedgerSequence The last ledger sequence the transaction will be valid in.
 * @param sequence The sequence number for the sending account.
 * @param account The address of the sending account.
 * @param publicKey The public key of the sending account, encoded as a hexadecimal string.
 */
function makeLegacyTransaction(
  value: string,
  destination: string,
  fee: string,
  lastLedgerSequence: number,
  sequence: number,
  account: string | undefined,
  publicKey: string,
): LegacyTransaction {
  const paymentAmount = new XRPAmount()
  paymentAmount.setDrops(value)

  const payment = new LegacyPayment()
  payment.setDestination(destination)
  payment.setXrpAmount(paymentAmount)

  const transactionFee = new XRPAmount()
  transactionFee.setDrops(fee)

  const transaction = new LegacyTransaction()
  transaction.setFee(transactionFee)
  transaction.setSequence(sequence)
  transaction.setPayment(payment)
  transaction.setSigningPublicKeyHex(publicKey)
  transaction.setLastLedgerSequence(lastLedgerSequence)

  // Account is an optional input so that malformed transaction serialization can be tested.
  if (account) {
    transaction.setAccount(account)
  }

  return transaction
}

describe('serializer', function(): void {
  it('serializes a legacy payment in XRP from a classic address', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeLegacyTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee,
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a legacy payment in XRP from an X-Address with no tag', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeLegacyTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountXAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: Utils.decodeXAddress(accountXAddress)!.address,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee,
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('fails to serializes a legacy payment in XRP from an X-Address with a tag', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP from a sender with a tag.
    const account = Utils.encodeXAddress(accountClassicAddress, tag)
    const transaction = makeLegacyTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      account,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('fails to serializes a legacy payment in XRP when account is undefined', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeLegacyTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      undefined,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes a legacy payment to an X-address with a tag in XRP', function(): void {
    // GIVEN a transaction which represents a payment to a destination and tag, denominated in XRP.
    const transaction = makeLegacyTransaction(
      value,
      destinationXAddressWithTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      DestinationTag: tag,
      Fee: fee,
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a legacy payment to an X-address without a tag in XRP', function(): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP.
    const transaction = makeLegacyTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.legacyTransactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee,
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment in XRP from a classic address', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment in XRP from an X-Address with no tag', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      accountXAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: Utils.decodeXAddress(accountXAddress)!.address,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('fails to serializes a payment in XRP from an X-Address with a tag', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP from a sender with a tag.
    const account = Utils.encodeXAddress(accountClassicAddress, tag)
    const transaction = makeTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      account,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('fails to serializes a payment in XRP when account is undefined', function(): void {
    // GIVEN a transaction which represents a payment denominated in XRP.
    const transaction = makeTransaction(
      value,
      destinationClassicAddress,
      fee,
      lastLedgerSequence,
      sequence,
      undefined,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is undefined.
    assert.isUndefined(serialized)
  })

  it('serializes a payment to an X-address with a tag in XRP', function(): void {
    // GIVEN a transaction which represents a payment to a destination and tag, denominated in XRP.
    const transaction = makeTransaction(
      value,
      destinationXAddressWithTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      DestinationTag: tag,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })

  it('serializes a payment to an X-address without a tag in XRP', function(): void {
    // GIVEN a transaction which represents a payment to a destination without a tag, denominated in XRP.
    const transaction = makeTransaction(
      value,
      destinationXAddressWithoutTag,
      fee,
      lastLedgerSequence,
      sequence,
      accountClassicAddress,
      publicKey,
    )

    // WHEN the transaction is serialized to JSON.
    const serialized = Serializer.transactionToJSON(transaction)

    // THEN the result is as expected.
    const expectedJSON = {
      Account: accountClassicAddress,
      Amount: value.toString(),
      Destination: destinationClassicAddress,
      Fee: fee.toString(),
      LastLedgerSequence: lastLedgerSequence,
      Sequence: sequence,
      TransactionType: 'Payment',
      SigningPubKey: publicKey,
    }
    assert.deepEqual(serialized, expectedJSON)
  })
})
