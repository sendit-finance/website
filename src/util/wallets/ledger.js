// https://raw.githubusercontent.com/project-serum/serum-dex-ui/master/src/wallet-adapters/ledger/index.tsx
// https://github.com/LedgerHQ/ledgerjs
// TODO include good docs like https://docs.solana.com/wallet-guide/solflare#using-a-ledger-nano-hardware-wallet

import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { getPublicKey, signTransaction } from './ledger-core'
import WalletAdaptor from './wallet-adaptor'

import debug from '@/util/log'
const log = debug.extend('util:wallets:ledger')

class LedgerWalletAdaptor extends WalletAdaptor {
  static _connectPromise = null

  constructor(opts) {
    super(opts)

    this._publicKey = null
    this._transport = null
  }

  get connected() {
    return this._publicKey !== null
  }
  get autoApprove() {
    return false
  }
  get publicKey() {
    if (!this._publicKey) return
    return this._publicKey
  }

  async signTransaction(xaction) {
    if (!this._transport || !this._publicKey) {
      throw new Error('Not connected to Ledger')
    }

    // @TODO: account selection (derivation path changes with account)
    const signature = await signTransaction(this._transport, xaction)
    xaction.addSignature(this._publicKey, signature)

    return xaction
  }

  async signAllTransactions(xactions) {
    // serum-dex-ui runs these one at a time. might be necessary to switch
    return Promise.all(
      xactions.map((xaction) => {
        return this.signTransaction(xaction)
      })
    )
  }

  async _connect() {
    try {
      log('%j', {
        WebHidSupported: await TransportWebHID.isSupported()
      })

      // https://github.com/LedgerHQ/ledgerjs/issues/607
      this._transport = await TransportWebHID.create()

      // @TODO: account selection
      this._publicKey = await getPublicKey(this._transport)
      this.emit('connect', this._publicKey)
      return [this._publicKey]
    } catch (err) {
      log('error', err.name, err)

      switch (err.name) {
        case 'TransportStatusError':
        case 'TransportInterfaceNotAvailable':
          err.notification = {
            title: 'Ledger wallet',
            message:
              'Please unlock your Ledger and open the Solana app, then try again',
            autoHide: true
          }
          break
        case 'TransportOpenUserCancelled':
          break
        case 'InvalidStateError':
          if (/already open/.test(err.message)) {
            err.notification = {
              title: 'Ledger wallet locked',
              message: 'To continue, please unlock your Ledger',
              autoHide: true
            }
          }
          break
      }

      LedgerWalletAdaptor._connectPromise = null
      this.disconnect()
      throw err
    }
  }

  async connect() {
    await this.disconnect()
    if (LedgerWalletAdaptor._connectPromise) {
      return LedgerWalletAdaptor._connectPromise
    }

    LedgerWalletAdaptor._connectPromise = this._connect()
    return LedgerWalletAdaptor._connectPromise
  }

  async disconnect() {
    let emit = false
    if (this._transport) {
      try {
        await this._transport.close()
      } catch (err) {
        log('error', err)
      }
      this._transport = null
      emit = true
    }

    LedgerWalletAdaptor._connectPromise = null
    this._publicKey = null

    if (emit) {
      this.emit('disconnect')
    }
  }
}

export default LedgerWalletAdaptor
