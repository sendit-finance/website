import SolWalletAdaptor from '@project-serum/sol-wallet-adapter'

class SolletWalletAdaptor extends SolWalletAdaptor {
  static provider = 'https://www.sollet.io'

  constructor(opts = {}) {
    super(SolletWalletAdaptor.provider, opts.network)
  }
}

export default SolletWalletAdaptor