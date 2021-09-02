import SolWalletAdaptor from '@project-serum/sol-wallet-adapter'

class SolletExtWalletAdaptor extends SolWalletAdaptor {
  static isExtension = true
  static get isInstalled() {
    return typeof window === 'undefined' ? false : !!window?.sollet
  }
  static installLink =
    'https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno'
  static displayName = 'Sollet Extension'
  static imgName = 'sollet'

  constructor(opts) {
    if (!SolletExtWalletAdaptor.isInstalled) {
      throw new Error('Sollet browser extension not installed')
    }

    super(window.sollet, opts.network)
  }
}

export default SolletExtWalletAdaptor
