import SolWalletAdaptor from '@sendit-finance/sol-wallet-adapter'

class SendItWalletAdaptor extends SolWalletAdaptor {
  static provider = 'https://identity.sendit.finance'

  constructor(opts = {}) {
    super(SendItWalletAdaptor.provider, opts.network)
    this.supportsEncryptDecrypt = true
  }
}

export default SendItWalletAdaptor
