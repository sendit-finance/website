import WalletAdaptor from './wallet-adaptor'
import { PublicKey } from '@solana/web3.js'
import Router from 'next/router'

class ReadOnlyWallet extends WalletAdaptor {
  get publicKey() {
    return this._publicKey
  }
  get autoApprove() {
    return false
  }
  get connected() {
    return this._connected
  }

  constructor(opts = {}) {
    super()

    this._connected = false

    try {
      this._publicKey = new PublicKey(opts.publicKey)
    } catch (e) {
      Router.push(window.location.pathname)
    }

    this.network = opts.network
  }

  async signTransaction(xaction) {
    throw new NotImplementedError()
  }
  async signAllTransactions(xactions) {
    throw new NotImplementedError()
  }
  async connect() {
    if (!this._publicKey) return

    this._connected = true

    this.emit('connect')
  }
  async disconnect() {
    this._connected = false
    this._publicKey = null

    this.emit('disconnect')
  }
  async sign() {
    throw new NotImplementedError()
  }

  static isHidden = true
}

export default ReadOnlyWallet
