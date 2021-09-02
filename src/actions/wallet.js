import { clusterApiUrl } from '@solana/web3.js'
import { ExclamationIcon } from '@heroicons/react/outline'
import * as Wallets from '@/util/wallets'
import Router from 'next/router'
import notificationActions from './notification'

import debug from '@/util/log'
const log = debug.extend('actions:wallet')

const actions = ({ setState, getState }) => ({
  connectWallet: (state, type, props) => {
    const Wallet = Wallets[type]
    if (!Wallet) {
      throw new Error(`wallet: invalid selection: ${type}`)
    }

    if (Wallet.isExtension && !Wallet.isInstalled) {
      notificationActions({ setState, getState }).addNotification(state, {
        title: `${type} wallet is not installed.`,
        message: `Please first install ${type} wallet.`,
        linkHref: Wallet.installLink,
        icon: ExclamationIcon,
        autoHide: true
      })

      return
    }

    if (state.wallet) {
      state.wallet.disconnect()
    }

    const network = clusterApiUrl(state.network)
    const wallet = new Wallet({ ...props, network })

    wallet.on('connect', () => {
      setState({
        connected: true,
        wallet
      })
      log(`wallet(${type}): connected`, String(wallet.publicKey))
    })

    wallet.on('disconnect', () => {
      setState({
        connected: false,
        wallet: null,
        account: undefined,
        portfolioHistory: [],
        confirmWallet: false,
        savingsAccounts: []
      })
      log(`wallet(${type}): disconnected`)
    })

    wallet.connect().catch((err) => {
      const notification = Object.assign(
        {
          title: `Wallet error`,
          message: `Please try connecting again.`,
          icon: ExclamationIcon,
          autoHide: true
        },
        err.notification
      )

      notificationActions({ setState, getState }).addNotification(
        state,
        notification
      )
    })
  },
  disconnectWallet: (state) => {
    state.wallet?.disconnect()
    //
    // Clear the route from get parameters.
    //

    Router.push(`${window.location.pathname}${window.location.search}`)
  },
  showNotification: (state, notification) => {
    const id = notificationActions({ setState, getState }).addNotification(
      state,
      notification
    )

    setState({
      confirmWallet: true
    })

    return id
  },
  hideNotification: (state, id) => {
    notificationActions({ setState, getState }).hideNotification(state, id)

    setState({
      confirmWallet: false
    })
  }
})

export default actions
