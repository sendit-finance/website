import EventEmitter from 'eventemitter3'

class NotImplementedError extends Error {
  constructor() {
    super('Method Not Implemented')
  }
}

class WalletAdaptor extends EventEmitter {
  get publicKey() {
    return ''
  }
  get autoApprove() {
    return false
  }
  get connected() {
    return false
  }

  constructor(opts = {}) {
    super()
    this.network = opts.network
  }

  async signTransaction(xaction) {
    throw new NotImplementedError()
  }
  async signAllTransactions(xactions) {
    throw new NotImplementedError()
  }
  async connect() {
    throw new NotImplementedError()
  }
  async disconnect() {
    throw new NotImplementedError()
  }
  async sign() {
    throw new NotImplementedError()
  }

  static isHidden = false
  static isExtension = false
  static get isInstalled() {
    return false
  }
  static installLink = ''
}

export default WalletAdaptor
