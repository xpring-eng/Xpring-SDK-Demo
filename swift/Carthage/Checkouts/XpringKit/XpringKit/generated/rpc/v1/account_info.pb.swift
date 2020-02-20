// DO NOT EDIT.
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: rpc/v1/account_info.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import Foundation
import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that your are building against the same version of the API
// that was used to generate this file.
fileprivate struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
  struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
  typealias Version = _2
}

/// A request to get info about an account.
public struct Rpc_V1_GetAccountInfoRequest {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  /// The address to get info about.
  public var account: Rpc_V1_AccountAddress {
    get {return _storage._account ?? Rpc_V1_AccountAddress()}
    set {_uniqueStorage()._account = newValue}
  }
  /// Returns true if `account` has been explicitly set.
  public var hasAccount: Bool {return _storage._account != nil}
  /// Clears the value of `account`. Subsequent reads from it will return its default value.
  public mutating func clearAccount() {_uniqueStorage()._account = nil}

  public var strict: Bool {
    get {return _storage._strict}
    set {_uniqueStorage()._strict = newValue}
  }

  public var ledger: Rpc_V1_LedgerSpecifier {
    get {return _storage._ledger ?? Rpc_V1_LedgerSpecifier()}
    set {_uniqueStorage()._ledger = newValue}
  }
  /// Returns true if `ledger` has been explicitly set.
  public var hasLedger: Bool {return _storage._ledger != nil}
  /// Clears the value of `ledger`. Subsequent reads from it will return its default value.
  public mutating func clearLedger() {_uniqueStorage()._ledger = nil}

  public var queue: Bool {
    get {return _storage._queue}
    set {_uniqueStorage()._queue = newValue}
  }

  public var signerLists: Bool {
    get {return _storage._signerLists}
    set {_uniqueStorage()._signerLists = newValue}
  }

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}

  fileprivate var _storage = _StorageClass.defaultInstance
}

public struct Rpc_V1_LedgerSpecifier {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var ledger: Rpc_V1_LedgerSpecifier.OneOf_Ledger? = nil

  public var shortcut: Rpc_V1_LedgerSpecifier.Shortcut {
    get {
      if case .shortcut(let v)? = ledger {return v}
      return .unspecified
    }
    set {ledger = .shortcut(newValue)}
  }

  public var sequence: UInt32 {
    get {
      if case .sequence(let v)? = ledger {return v}
      return 0
    }
    set {ledger = .sequence(newValue)}
  }

  /// 32 bytes
  public var hash: Data {
    get {
      if case .hash(let v)? = ledger {return v}
      return SwiftProtobuf.Internal.emptyData
    }
    set {ledger = .hash(newValue)}
  }

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public enum OneOf_Ledger: Equatable {
    case shortcut(Rpc_V1_LedgerSpecifier.Shortcut)
    case sequence(UInt32)
    /// 32 bytes
    case hash(Data)

  #if !swift(>=4.1)
    public static func ==(lhs: Rpc_V1_LedgerSpecifier.OneOf_Ledger, rhs: Rpc_V1_LedgerSpecifier.OneOf_Ledger) -> Bool {
      switch (lhs, rhs) {
      case (.shortcut(let l), .shortcut(let r)): return l == r
      case (.sequence(let l), .sequence(let r)): return l == r
      case (.hash(let l), .hash(let r)): return l == r
      default: return false
      }
    }
  #endif
  }

  public enum Shortcut: SwiftProtobuf.Enum {
    public typealias RawValue = Int
    case unspecified // = 0
    case validated // = 1
    case closed // = 2
    case current // = 3
    case UNRECOGNIZED(Int)

    public init() {
      self = .unspecified
    }

    public init?(rawValue: Int) {
      switch rawValue {
      case 0: self = .unspecified
      case 1: self = .validated
      case 2: self = .closed
      case 3: self = .current
      default: self = .UNRECOGNIZED(rawValue)
      }
    }

    public var rawValue: Int {
      switch self {
      case .unspecified: return 0
      case .validated: return 1
      case .closed: return 2
      case .current: return 3
      case .UNRECOGNIZED(let i): return i
      }
    }

  }

  public init() {}
}

#if swift(>=4.2)

extension Rpc_V1_LedgerSpecifier.Shortcut: CaseIterable {
  // The compiler won't synthesize support with the UNRECOGNIZED case.
  public static var allCases: [Rpc_V1_LedgerSpecifier.Shortcut] = [
    .unspecified,
    .validated,
    .closed,
    .current,
  ]
}

#endif  // swift(>=4.2)

/// Response to GetAccountInfo RPC
public struct Rpc_V1_GetAccountInfoResponse {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var accountData: Rpc_V1_AccountRoot {
    get {return _storage._accountData ?? Rpc_V1_AccountRoot()}
    set {_uniqueStorage()._accountData = newValue}
  }
  /// Returns true if `accountData` has been explicitly set.
  public var hasAccountData: Bool {return _storage._accountData != nil}
  /// Clears the value of `accountData`. Subsequent reads from it will return its default value.
  public mutating func clearAccountData() {_uniqueStorage()._accountData = nil}

  public var signerList: Rpc_V1_SignerList {
    get {return _storage._signerList ?? Rpc_V1_SignerList()}
    set {_uniqueStorage()._signerList = newValue}
  }
  /// Returns true if `signerList` has been explicitly set.
  public var hasSignerList: Bool {return _storage._signerList != nil}
  /// Clears the value of `signerList`. Subsequent reads from it will return its default value.
  public mutating func clearSignerList() {_uniqueStorage()._signerList = nil}

  public var ledgerIndex: UInt32 {
    get {return _storage._ledgerIndex}
    set {_uniqueStorage()._ledgerIndex = newValue}
  }

  public var queueData: Rpc_V1_QueueData {
    get {return _storage._queueData ?? Rpc_V1_QueueData()}
    set {_uniqueStorage()._queueData = newValue}
  }
  /// Returns true if `queueData` has been explicitly set.
  public var hasQueueData: Bool {return _storage._queueData != nil}
  /// Clears the value of `queueData`. Subsequent reads from it will return its default value.
  public mutating func clearQueueData() {_uniqueStorage()._queueData = nil}

  public var validated: Bool {
    get {return _storage._validated}
    set {_uniqueStorage()._validated = newValue}
  }

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}

  fileprivate var _storage = _StorageClass.defaultInstance
}

/// Aggregate data about queued transactions
public struct Rpc_V1_QueueData {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var txnCount: UInt32 {
    get {return _storage._txnCount}
    set {_uniqueStorage()._txnCount = newValue}
  }

  public var authChangeQueued: Bool {
    get {return _storage._authChangeQueued}
    set {_uniqueStorage()._authChangeQueued = newValue}
  }

  public var lowestSequence: UInt32 {
    get {return _storage._lowestSequence}
    set {_uniqueStorage()._lowestSequence = newValue}
  }

  public var highestSequence: UInt32 {
    get {return _storage._highestSequence}
    set {_uniqueStorage()._highestSequence = newValue}
  }

  public var maxSpendDropsTotal: Rpc_V1_XRPDropsAmount {
    get {return _storage._maxSpendDropsTotal ?? Rpc_V1_XRPDropsAmount()}
    set {_uniqueStorage()._maxSpendDropsTotal = newValue}
  }
  /// Returns true if `maxSpendDropsTotal` has been explicitly set.
  public var hasMaxSpendDropsTotal: Bool {return _storage._maxSpendDropsTotal != nil}
  /// Clears the value of `maxSpendDropsTotal`. Subsequent reads from it will return its default value.
  public mutating func clearMaxSpendDropsTotal() {_uniqueStorage()._maxSpendDropsTotal = nil}

  public var transactions: [Rpc_V1_QueuedTransaction] {
    get {return _storage._transactions}
    set {_uniqueStorage()._transactions = newValue}
  }

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}

  fileprivate var _storage = _StorageClass.defaultInstance
}

/// Data about a single queued transaction
public struct Rpc_V1_QueuedTransaction {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var authChange: Bool {
    get {return _storage._authChange}
    set {_uniqueStorage()._authChange = newValue}
  }

  public var fee: Rpc_V1_XRPDropsAmount {
    get {return _storage._fee ?? Rpc_V1_XRPDropsAmount()}
    set {_uniqueStorage()._fee = newValue}
  }
  /// Returns true if `fee` has been explicitly set.
  public var hasFee: Bool {return _storage._fee != nil}
  /// Clears the value of `fee`. Subsequent reads from it will return its default value.
  public mutating func clearFee() {_uniqueStorage()._fee = nil}

  public var feeLevel: UInt64 {
    get {return _storage._feeLevel}
    set {_uniqueStorage()._feeLevel = newValue}
  }

  public var maxSpendDrops: Rpc_V1_XRPDropsAmount {
    get {return _storage._maxSpendDrops ?? Rpc_V1_XRPDropsAmount()}
    set {_uniqueStorage()._maxSpendDrops = newValue}
  }
  /// Returns true if `maxSpendDrops` has been explicitly set.
  public var hasMaxSpendDrops: Bool {return _storage._maxSpendDrops != nil}
  /// Clears the value of `maxSpendDrops`. Subsequent reads from it will return its default value.
  public mutating func clearMaxSpendDrops() {_uniqueStorage()._maxSpendDrops = nil}

  public var sequence: UInt32 {
    get {return _storage._sequence}
    set {_uniqueStorage()._sequence = newValue}
  }

  public var lastLedgerSequence: UInt32 {
    get {return _storage._lastLedgerSequence}
    set {_uniqueStorage()._lastLedgerSequence = newValue}
  }

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}

  fileprivate var _storage = _StorageClass.defaultInstance
}

// MARK: - Code below here is support for the SwiftProtobuf runtime.

fileprivate let _protobuf_package = "rpc.v1"

extension Rpc_V1_GetAccountInfoRequest: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".GetAccountInfoRequest"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "account"),
    2: .same(proto: "strict"),
    3: .same(proto: "ledger"),
    4: .same(proto: "queue"),
    5: .standard(proto: "signer_lists"),
  ]

  fileprivate class _StorageClass {
    var _account: Rpc_V1_AccountAddress? = nil
    var _strict: Bool = false
    var _ledger: Rpc_V1_LedgerSpecifier? = nil
    var _queue: Bool = false
    var _signerLists: Bool = false

    static let defaultInstance = _StorageClass()

    private init() {}

    init(copying source: _StorageClass) {
      _account = source._account
      _strict = source._strict
      _ledger = source._ledger
      _queue = source._queue
      _signerLists = source._signerLists
    }
  }

  fileprivate mutating func _uniqueStorage() -> _StorageClass {
    if !isKnownUniquelyReferenced(&_storage) {
      _storage = _StorageClass(copying: _storage)
    }
    return _storage
  }

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    _ = _uniqueStorage()
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      while let fieldNumber = try decoder.nextFieldNumber() {
        switch fieldNumber {
        case 1: try decoder.decodeSingularMessageField(value: &_storage._account)
        case 2: try decoder.decodeSingularBoolField(value: &_storage._strict)
        case 3: try decoder.decodeSingularMessageField(value: &_storage._ledger)
        case 4: try decoder.decodeSingularBoolField(value: &_storage._queue)
        case 5: try decoder.decodeSingularBoolField(value: &_storage._signerLists)
        default: break
        }
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      if let v = _storage._account {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 1)
      }
      if _storage._strict != false {
        try visitor.visitSingularBoolField(value: _storage._strict, fieldNumber: 2)
      }
      if let v = _storage._ledger {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 3)
      }
      if _storage._queue != false {
        try visitor.visitSingularBoolField(value: _storage._queue, fieldNumber: 4)
      }
      if _storage._signerLists != false {
        try visitor.visitSingularBoolField(value: _storage._signerLists, fieldNumber: 5)
      }
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Rpc_V1_GetAccountInfoRequest, rhs: Rpc_V1_GetAccountInfoRequest) -> Bool {
    if lhs._storage !== rhs._storage {
      let storagesAreEqual: Bool = withExtendedLifetime((lhs._storage, rhs._storage)) { (_args: (_StorageClass, _StorageClass)) in
        let _storage = _args.0
        let rhs_storage = _args.1
        if _storage._account != rhs_storage._account {return false}
        if _storage._strict != rhs_storage._strict {return false}
        if _storage._ledger != rhs_storage._ledger {return false}
        if _storage._queue != rhs_storage._queue {return false}
        if _storage._signerLists != rhs_storage._signerLists {return false}
        return true
      }
      if !storagesAreEqual {return false}
    }
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Rpc_V1_LedgerSpecifier: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".LedgerSpecifier"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "shortcut"),
    2: .same(proto: "sequence"),
    3: .same(proto: "hash"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      switch fieldNumber {
      case 1:
        if self.ledger != nil {try decoder.handleConflictingOneOf()}
        var v: Rpc_V1_LedgerSpecifier.Shortcut?
        try decoder.decodeSingularEnumField(value: &v)
        if let v = v {self.ledger = .shortcut(v)}
      case 2:
        if self.ledger != nil {try decoder.handleConflictingOneOf()}
        var v: UInt32?
        try decoder.decodeSingularUInt32Field(value: &v)
        if let v = v {self.ledger = .sequence(v)}
      case 3:
        if self.ledger != nil {try decoder.handleConflictingOneOf()}
        var v: Data?
        try decoder.decodeSingularBytesField(value: &v)
        if let v = v {self.ledger = .hash(v)}
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    switch self.ledger {
    case .shortcut(let v)?:
      try visitor.visitSingularEnumField(value: v, fieldNumber: 1)
    case .sequence(let v)?:
      try visitor.visitSingularUInt32Field(value: v, fieldNumber: 2)
    case .hash(let v)?:
      try visitor.visitSingularBytesField(value: v, fieldNumber: 3)
    case nil: break
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Rpc_V1_LedgerSpecifier, rhs: Rpc_V1_LedgerSpecifier) -> Bool {
    if lhs.ledger != rhs.ledger {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Rpc_V1_LedgerSpecifier.Shortcut: SwiftProtobuf._ProtoNameProviding {
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    0: .same(proto: "SHORTCUT_UNSPECIFIED"),
    1: .same(proto: "SHORTCUT_VALIDATED"),
    2: .same(proto: "SHORTCUT_CLOSED"),
    3: .same(proto: "SHORTCUT_CURRENT"),
  ]
}

extension Rpc_V1_GetAccountInfoResponse: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".GetAccountInfoResponse"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .standard(proto: "account_data"),
    2: .standard(proto: "signer_list"),
    3: .standard(proto: "ledger_index"),
    4: .standard(proto: "queue_data"),
    5: .same(proto: "validated"),
  ]

  fileprivate class _StorageClass {
    var _accountData: Rpc_V1_AccountRoot? = nil
    var _signerList: Rpc_V1_SignerList? = nil
    var _ledgerIndex: UInt32 = 0
    var _queueData: Rpc_V1_QueueData? = nil
    var _validated: Bool = false

    static let defaultInstance = _StorageClass()

    private init() {}

    init(copying source: _StorageClass) {
      _accountData = source._accountData
      _signerList = source._signerList
      _ledgerIndex = source._ledgerIndex
      _queueData = source._queueData
      _validated = source._validated
    }
  }

  fileprivate mutating func _uniqueStorage() -> _StorageClass {
    if !isKnownUniquelyReferenced(&_storage) {
      _storage = _StorageClass(copying: _storage)
    }
    return _storage
  }

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    _ = _uniqueStorage()
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      while let fieldNumber = try decoder.nextFieldNumber() {
        switch fieldNumber {
        case 1: try decoder.decodeSingularMessageField(value: &_storage._accountData)
        case 2: try decoder.decodeSingularMessageField(value: &_storage._signerList)
        case 3: try decoder.decodeSingularUInt32Field(value: &_storage._ledgerIndex)
        case 4: try decoder.decodeSingularMessageField(value: &_storage._queueData)
        case 5: try decoder.decodeSingularBoolField(value: &_storage._validated)
        default: break
        }
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      if let v = _storage._accountData {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 1)
      }
      if let v = _storage._signerList {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 2)
      }
      if _storage._ledgerIndex != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._ledgerIndex, fieldNumber: 3)
      }
      if let v = _storage._queueData {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 4)
      }
      if _storage._validated != false {
        try visitor.visitSingularBoolField(value: _storage._validated, fieldNumber: 5)
      }
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Rpc_V1_GetAccountInfoResponse, rhs: Rpc_V1_GetAccountInfoResponse) -> Bool {
    if lhs._storage !== rhs._storage {
      let storagesAreEqual: Bool = withExtendedLifetime((lhs._storage, rhs._storage)) { (_args: (_StorageClass, _StorageClass)) in
        let _storage = _args.0
        let rhs_storage = _args.1
        if _storage._accountData != rhs_storage._accountData {return false}
        if _storage._signerList != rhs_storage._signerList {return false}
        if _storage._ledgerIndex != rhs_storage._ledgerIndex {return false}
        if _storage._queueData != rhs_storage._queueData {return false}
        if _storage._validated != rhs_storage._validated {return false}
        return true
      }
      if !storagesAreEqual {return false}
    }
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Rpc_V1_QueueData: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".QueueData"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .standard(proto: "txn_count"),
    2: .standard(proto: "auth_change_queued"),
    3: .standard(proto: "lowest_sequence"),
    4: .standard(proto: "highest_sequence"),
    5: .standard(proto: "max_spend_drops_total"),
    6: .same(proto: "transactions"),
  ]

  fileprivate class _StorageClass {
    var _txnCount: UInt32 = 0
    var _authChangeQueued: Bool = false
    var _lowestSequence: UInt32 = 0
    var _highestSequence: UInt32 = 0
    var _maxSpendDropsTotal: Rpc_V1_XRPDropsAmount? = nil
    var _transactions: [Rpc_V1_QueuedTransaction] = []

    static let defaultInstance = _StorageClass()

    private init() {}

    init(copying source: _StorageClass) {
      _txnCount = source._txnCount
      _authChangeQueued = source._authChangeQueued
      _lowestSequence = source._lowestSequence
      _highestSequence = source._highestSequence
      _maxSpendDropsTotal = source._maxSpendDropsTotal
      _transactions = source._transactions
    }
  }

  fileprivate mutating func _uniqueStorage() -> _StorageClass {
    if !isKnownUniquelyReferenced(&_storage) {
      _storage = _StorageClass(copying: _storage)
    }
    return _storage
  }

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    _ = _uniqueStorage()
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      while let fieldNumber = try decoder.nextFieldNumber() {
        switch fieldNumber {
        case 1: try decoder.decodeSingularUInt32Field(value: &_storage._txnCount)
        case 2: try decoder.decodeSingularBoolField(value: &_storage._authChangeQueued)
        case 3: try decoder.decodeSingularUInt32Field(value: &_storage._lowestSequence)
        case 4: try decoder.decodeSingularUInt32Field(value: &_storage._highestSequence)
        case 5: try decoder.decodeSingularMessageField(value: &_storage._maxSpendDropsTotal)
        case 6: try decoder.decodeRepeatedMessageField(value: &_storage._transactions)
        default: break
        }
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      if _storage._txnCount != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._txnCount, fieldNumber: 1)
      }
      if _storage._authChangeQueued != false {
        try visitor.visitSingularBoolField(value: _storage._authChangeQueued, fieldNumber: 2)
      }
      if _storage._lowestSequence != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._lowestSequence, fieldNumber: 3)
      }
      if _storage._highestSequence != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._highestSequence, fieldNumber: 4)
      }
      if let v = _storage._maxSpendDropsTotal {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 5)
      }
      if !_storage._transactions.isEmpty {
        try visitor.visitRepeatedMessageField(value: _storage._transactions, fieldNumber: 6)
      }
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Rpc_V1_QueueData, rhs: Rpc_V1_QueueData) -> Bool {
    if lhs._storage !== rhs._storage {
      let storagesAreEqual: Bool = withExtendedLifetime((lhs._storage, rhs._storage)) { (_args: (_StorageClass, _StorageClass)) in
        let _storage = _args.0
        let rhs_storage = _args.1
        if _storage._txnCount != rhs_storage._txnCount {return false}
        if _storage._authChangeQueued != rhs_storage._authChangeQueued {return false}
        if _storage._lowestSequence != rhs_storage._lowestSequence {return false}
        if _storage._highestSequence != rhs_storage._highestSequence {return false}
        if _storage._maxSpendDropsTotal != rhs_storage._maxSpendDropsTotal {return false}
        if _storage._transactions != rhs_storage._transactions {return false}
        return true
      }
      if !storagesAreEqual {return false}
    }
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Rpc_V1_QueuedTransaction: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".QueuedTransaction"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .standard(proto: "auth_change"),
    2: .same(proto: "fee"),
    3: .standard(proto: "fee_level"),
    4: .standard(proto: "max_spend_drops"),
    5: .same(proto: "sequence"),
    6: .standard(proto: "last_ledger_sequence"),
  ]

  fileprivate class _StorageClass {
    var _authChange: Bool = false
    var _fee: Rpc_V1_XRPDropsAmount? = nil
    var _feeLevel: UInt64 = 0
    var _maxSpendDrops: Rpc_V1_XRPDropsAmount? = nil
    var _sequence: UInt32 = 0
    var _lastLedgerSequence: UInt32 = 0

    static let defaultInstance = _StorageClass()

    private init() {}

    init(copying source: _StorageClass) {
      _authChange = source._authChange
      _fee = source._fee
      _feeLevel = source._feeLevel
      _maxSpendDrops = source._maxSpendDrops
      _sequence = source._sequence
      _lastLedgerSequence = source._lastLedgerSequence
    }
  }

  fileprivate mutating func _uniqueStorage() -> _StorageClass {
    if !isKnownUniquelyReferenced(&_storage) {
      _storage = _StorageClass(copying: _storage)
    }
    return _storage
  }

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    _ = _uniqueStorage()
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      while let fieldNumber = try decoder.nextFieldNumber() {
        switch fieldNumber {
        case 1: try decoder.decodeSingularBoolField(value: &_storage._authChange)
        case 2: try decoder.decodeSingularMessageField(value: &_storage._fee)
        case 3: try decoder.decodeSingularUInt64Field(value: &_storage._feeLevel)
        case 4: try decoder.decodeSingularMessageField(value: &_storage._maxSpendDrops)
        case 5: try decoder.decodeSingularUInt32Field(value: &_storage._sequence)
        case 6: try decoder.decodeSingularUInt32Field(value: &_storage._lastLedgerSequence)
        default: break
        }
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    try withExtendedLifetime(_storage) { (_storage: _StorageClass) in
      if _storage._authChange != false {
        try visitor.visitSingularBoolField(value: _storage._authChange, fieldNumber: 1)
      }
      if let v = _storage._fee {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 2)
      }
      if _storage._feeLevel != 0 {
        try visitor.visitSingularUInt64Field(value: _storage._feeLevel, fieldNumber: 3)
      }
      if let v = _storage._maxSpendDrops {
        try visitor.visitSingularMessageField(value: v, fieldNumber: 4)
      }
      if _storage._sequence != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._sequence, fieldNumber: 5)
      }
      if _storage._lastLedgerSequence != 0 {
        try visitor.visitSingularUInt32Field(value: _storage._lastLedgerSequence, fieldNumber: 6)
      }
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Rpc_V1_QueuedTransaction, rhs: Rpc_V1_QueuedTransaction) -> Bool {
    if lhs._storage !== rhs._storage {
      let storagesAreEqual: Bool = withExtendedLifetime((lhs._storage, rhs._storage)) { (_args: (_StorageClass, _StorageClass)) in
        let _storage = _args.0
        let rhs_storage = _args.1
        if _storage._authChange != rhs_storage._authChange {return false}
        if _storage._fee != rhs_storage._fee {return false}
        if _storage._feeLevel != rhs_storage._feeLevel {return false}
        if _storage._maxSpendDrops != rhs_storage._maxSpendDrops {return false}
        if _storage._sequence != rhs_storage._sequence {return false}
        if _storage._lastLedgerSequence != rhs_storage._lastLedgerSequence {return false}
        return true
      }
      if !storagesAreEqual {return false}
    }
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}