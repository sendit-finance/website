import bs58 from 'bs58'
import walletActions from './wallet'

import debug from '@/util/log'
const log = debug.extend('actions:account')

const SENDIT_API_URL = process.env.NEXT_PUBLIC_SENDIT_API_URL

const actions = ({ setState, getState }) => ({
  getAccount: async function (state) {
    if (!state.wallet?.publicKey) return

    const publicKey = state.wallet.publicKey.toBase58()

    const response = await fetch(`${SENDIT_API_URL}/account/${publicKey}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status !== 200) return

    state.wallet.once('disconnect', () => {
      setState({ account: undefined })
    })

    setState({ account: await response.json() })
  },
  createAccount: async function (state) {
    if (!state.wallet) return
    if (state.confirmWallet) return

    const id = walletActions({ setState, getState }).showNotification(state, {
      title: 'Confirm account creation',
      message: 'Please confirm the account creation using your wallet.'
    })

    const { publicKey } = await state.wallet.getEncryptionPublicKey()

    walletActions({ setState, getState }).hideNotification(state, id)

    const response = await fetch(`${SENDIT_API_URL}/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        publicKey: state.wallet.publicKey.toBase58(),
        encryptionPublicKey: publicKey
      })
    })

    if (response.status !== 200) return

    state.wallet.once('disconnect', () => {
      setState({ account: undefined })
    })

    setState({ account: await response.json() })
  },
  getPortfolioValue: async function (state, force) {
    if (!state.wallet) return
    if (state.portfolioHistory.length && !force) return
    if (state.confirmWallet) return
    if (state.skipPortfolioHistory) return

    const publicKey = state.wallet.publicKey.toBase58()

    const response = await fetch(
      `${SENDIT_API_URL}/account/${publicKey}/portfolio?limit=200`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status !== 200) return

    const result = await response.json()

    const messages = result.items.map((item) =>
      bs58.encode(Buffer.from(item.value, 'base64'))
    )

    //
    // We want at least two data points for the
    // portfolio history
    //
    if (messages.length < 2) return

    // see if theres new items to decrypt
    if (state.portfolioHistory.length === messages.length) return

    const id = walletActions({ setState, getState }).showNotification(state, {
      title: 'Fetch portfolio history',
      message:
        'Please confirm that you would like to fetch your portfolio history with your wallet.',
      action: {
        message: 'Click to open wallet.',
        onClick: () => state.wallet.focus()
      }
    })

    // try/catch to handle when customer closes wallet window or denies
    try {
      // TODO add a timeout and cancel if user doesn't respond
      state.wallet.focus()

      const decrypted = await state.wallet.decrypt({
        messages
      })

      state.wallet.once('disconnect', () => {
        setState({ portfolioHistory: [] })
      })

      setState({
        portfolioHistory: decrypted.messages.map((value, index) => {
          return {
            timestamp: result.items[index].timestamp,
            value
          }
        })
      })
    } catch (err) {
      if (/Transaction cancelled/.test(err.message)) {
        setState({ skipPortfolioHistory: true })
      } else {
        log('error', err)
      }
    }

    walletActions({ setState, getState }).hideNotification(state, id)
  }
})

export default actions
