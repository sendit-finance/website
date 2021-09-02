import WalletAdaptor from './wallet-adaptor'
import { PublicKey } from '@solana/web3.js'

import debug from '@/util/log'
const log = debug.extend('util:wallets:math')

// https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc

class MathWalletAdaptor extends WalletAdaptor {
  static isExtension = true
  static get isInstalled() {
    return typeof window === 'undefined'
      ? false
      : !!window?.solana?.isMathWallet
  }
  static installLink = 'https://mathwallet.net/'
  static _connectPromise = null

  constructor(opts) {
    super(opts)

    if (!MathWalletAdaptor.isInstalled) {
      throw new Error('Math wallet is not installed')
    }

    this._solana = window?.solana
    this._publicKey = null
    this._connected = false
  }

  get connected() {
    return !!this._connected
  }
  get autoApprove() {
    return false
  }
  get publicKey() {
    return this._publicKey
  }

  async signTransaction(xaction) {
    if (!this.connected) {
      throw new Error('Not connected')
    }

    return this._solana.signTransaction(xaction)
  }

  async signAllTransactions(xactions) {
    if (!this.connected) {
      throw new Error('Not connected')
    }

    return this._solana.signAllTransactions(xactions)
  }

  async connect() {
    if (MathWalletAdaptor._connectPromise) {
      return MathWalletAdaptor._connectPromise
    }

    MathWalletAdaptor._connectPromise = this._solana
      .getAccount()
      .then((account) => {
        this._connected = true
        this._publicKey = new PublicKey(account)
        this.emit('connect', this._publicKey)
        return [this._publicKey]
      })
      .catch((err) => {
        log('error', err)
        // TODO, handle "Error: The wallet has been locked and needs to be unlocked for further operation!"
        this.disconnect()
        throw err
      })

    return MathWalletAdaptor._connectPromise
  }

  async disconnect() {
    MathWalletAdaptor._connectPromise = null
    this._connected = false
    this._publicKey = null
    this.emit('disconnect')
  }
}

export default MathWalletAdaptor
