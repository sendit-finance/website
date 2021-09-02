import SolWalletAdaptor from '@project-serum/sol-wallet-adapter'

class BonfidaWalletAdaptor extends SolWalletAdaptor {
  static provider = 'https://bonfida.com/wallet'

  constructor(opts = {}) {
    super(BonfidaWalletAdaptor.provider, opts.network)
  }
}

export default BonfidaWalletAdaptor