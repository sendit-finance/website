import WalletAdaptor from './wallet-adaptor'
import { PublicKey } from '@solana/web3.js'

// https://docs.phantom.app/

class PhantomWalletAdaptor extends WalletAdaptor {
  static isExtension = true
  static get isInstalled() {
    return typeof window === 'undefined' ? false : !!window?.solana?.isPhantom
  }
  static installLink = 'https://phantom.app/'
  static _connectPromise = null

  constructor(opts) {
    super(opts)

    if (!PhantomWalletAdaptor.isInstalled) {
      throw new Error('Phantom wallet is not installed')
    }

    this._solana = window?.solana
  }

  get connected() {
    return !!this._solana.isConnected
  }
  get autoApprove() {
    return !!this._solana.autoApprove
  }
  get publicKey() {
    if (!this._solana.publicKey) return
    const key = new PublicKey(String(this._solana.publicKey))
    return key
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
    if (PhantomWalletAdaptor._connectPromise) {
      return PhantomWalletAdaptor._connectPromise
    }

    PhantomWalletAdaptor._connectPromise = new Promise((resolve, reject) => {
      this._solana.once('connect', (...args) => {
        PhantomWalletAdaptor._connectPromise = null
        this.emit('connect', ...args)
        resolve(args)
      })

      this._solana.once('disconnect', (...args) => {
        PhantomWalletAdaptor._connectPromise = null
        this.emit('disconnect', ...args)
      })

      this._solana.connect()
    })

    return PhantomWalletAdaptor._connectPromise
  }

  async disconnect() {
    PhantomWalletAdaptor._connectPromise = null
    return this._solana.disconnect()
  }
}

export default PhantomWalletAdaptor
