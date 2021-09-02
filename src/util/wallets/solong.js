import WalletAdaptor from './wallet-adaptor'
import { PublicKey } from '@solana/web3.js'

import debug from '@/util/log'
const log = debug.extend('util:wallets:solong')

// https://solongwallet.com/
// https://chrome.google.com/webstore/detail/solong/memijejgibaodndkimcclfapfladdchj
//
// This wallet is not well documented. Integration guide is here:
//   https://solongwallet.medium.com/using-solong-in-serum-swap-a01f8d075192

class SolongWalletAdaptor extends WalletAdaptor {
  static isExtension = true
  static get isInstalled() {
    return typeof window === 'undefined' ? false : !!window.solong
  }
  static installLink = 'https://solongwallet.com/'
  static _connectPromise = null

  constructor(opts) {
    super(opts)

    if (!SolongWalletAdaptor.isInstalled) {
      throw new Error('Solong wallet is not installed')
    }

    this._solong = window.solong
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

    return this._solong.signTransaction(xaction)
  }

  async signAllTransactions(xactions) {
    if (!this.connected) {
      throw new Error('Not connected')
    }

    if (this._solong.signAllTransactions) {
      return this._solong.signAllTransactions(xactions)
    }

    return Promise.all(
      xactions.map((xaction) => {
        return this.signTransaction(xaction)
      })
    )
  }

  async connect() {
    if (SolongWalletAdaptor._connectPromise) {
      return SolongWalletAdaptor._connectPromise
    }

    SolongWalletAdaptor._connectPromise = this._solong
      .selectAccount()
      .then((account) => {
        this._connected = true
        this._publicKey = new PublicKey(account)
        this.emit('connect', this._publicKey)
        return [this._publicKey]
      })
      .catch((err) => {
        log('error', err)
        this.disconnect()
        throw err
      })

    return SolongWalletAdaptor._connectPromise
  }

  async disconnect() {
    SolongWalletAdaptor._connectPromise = null
    this._connected = false
    this._publicKey = null
    this.emit('disconnect')
  }
}

export default SolongWalletAdaptor
