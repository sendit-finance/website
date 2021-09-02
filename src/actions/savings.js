import Big from 'bignumber.js'
import { LAMPORTS_PER_SOL, StakeProgram } from '@solana/web3.js'
import Emitter from 'eventemitter3'
import { ExclamationIcon } from '@heroicons/react/outline'
import snooze from '@/util/sleep'

import {
  createSolanaStakeTransaction,
  fetchSolStakes,
  getSeedPrefix
} from '@sendit-finance/solana-garage/staking'
import { fetchSolBalance } from '@sendit-finance/solana-garage/tokens'
import notificationActions from './notification'
import { confirmTransaction } from '@/util/confirm-transaction'
import {
  handleReopenAccount,
  handleWithdrawAccount,
  handleCloseAccount
} from '@/util/stakes'

import { log as debug } from '@sendit-finance/solana-garage/util'
const log = debug.extend('actions:savings')

const _fetchSavingsAccounts = async ({ state, connection }) => {
  if (!state.connected) return

  const publicKey = state.wallet.publicKey
  const emitter = new Emitter()

  const savingsAccounts = []
  emitter.on('stake', (stake) => savingsAccounts.push(stake))

  await fetchSolStakes({
    seedPrefix: getSeedPrefix(publicKey),
    type: 'savings',
    connection,
    publicKey,
    emitter
  })

  return savingsAccounts
}

const retry = async ({ fn, sleep = 5, attempts = 2 }) => {
  try {
    return await fn()
  } catch (err) {
    if (attempts > 0) {
      await snooze(sleep)
      return retry({ fn, sleep, attempts: attempts - 1 })
    }
    throw err
  }
}

/**
 * Tracks loading state
 */
let isLoadingSavings = false

const fetchSavingsAccounts = async ({ state, setState, connection }) => {
  log('fetchSavingsAccounts - isLoading?', isLoadingSavings)
  if (isLoadingSavings) return

  isLoadingSavings = true
  setState({ isLoadingSavings })

  const newState = {}

  try {
    const savingsAccounts = await retry({
      fn: () => _fetchSavingsAccounts({ state, connection }),
      sleep: 5,
      attempts: 5
    })

    newState.savingsAccounts = savingsAccounts
  } finally {
    isLoadingSavings = false
    newState.isLoadingSavings = isLoadingSavings
    log('fetchSavingsAccounts setState', newState)
    setState(newState)
  }
}

const actions = ({ getState, setState }) => ({
  initializeSavingsPortfolio: () => {
    setState({ proposedAmount: new Big(0), newSavingsAccountStatus: undefined })
  },
  fetchSavingsAccounts: async (state) => {
    const connection = state.readableConnection
    fetchSavingsAccounts({ state, setState, connection })
  },
  fetchSolBalance: async (state) => {
    const connection = state.readableConnection
    const publicKey = state.wallet?.publicKey

    log('fetchSolBalance', state.connected, { connection, publicKey })
    if (!(connection && publicKey)) return

    const solBalance = await fetchSolBalance(connection, publicKey)
    log('solana balance', solBalance)
    setState({ solBalance })
  },
  handleAmountChange: (state, evt) => {
    const val = evt.target.value
    setState({ proposedAmount: new Big(val) })
  },
  handleOpenAccount: async (state, evt, hideDialog) => {
    if (!state.solBalance) {
      notificationActions({ setState, getState }).addNotification(state, {
        title: `SOL balance not yet available.`,
        message: `Please try again in a second.`,
        icon: ExclamationIcon,
        autoHide: true
      })
      return
    }

    // use same RPC node for all calls so we can read our own writes
    const connection = state.getWritableConnection()

    try {
      log('handleOpenAccount', state, evt)

      evt.preventDefault()

      const amount = state.proposedAmount
      log('proposed amount is', amount?.toFixed())

      if (!amount || amount.isNaN() || amount.isZero()) {
        notificationActions({ setState, getState }).addNotification(state, {
          message: `Stake amount must be more than zero`,
          title: `Error`,
          icon: ExclamationIcon,
          autoHide: true
        })
        return
      }

      if (amount.gte(state.solBalance.amount.fixed())) {
        notificationActions({ setState, getState }).addNotification(state, {
          message: `Stake amount must be less than current balance`,
          title: `Error`,
          icon: ExclamationIcon,
          autoHide: true
        })
        return
      }

      setState({ newSavingsAccountStatus: 'opening'})

      const customerPubkey = state.wallet.publicKey
      const seedPrefix = getSeedPrefix(customerPubkey)
      log('seedPrefix', seedPrefix)

      const transaction = await createSolanaStakeTransaction({
        connection,
        publicKey: customerPubkey,
        lamports: state.proposedAmount.times(LAMPORTS_PER_SOL).toNumber(),
        seedPrefix
      })

      const { blockhash } = await connection.getRecentBlockhash()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = customerPubkey

      // ask for confirmation in wallet
      let signed;
      try {
        signed = await state.wallet.signTransaction(transaction)
      } catch (err) {
        setState({ newSavingsAccountStatus: undefined })

        if (/transaction cancelled|signature request denied/i.test(err.message)) {
          log('create stake transaction cancelled')
          return
        }

        throw err
      }

      const txId = await connection.sendRawTransaction(
        signed.serialize()
      )

      const link = `https://explorer.solana.com/tx/${txId}`
      log('sent stake transaction', link)

      const notificationId = notificationActions({ setState, getState }).addNotification(state, {
        title: `Opening savings account..`,
        autoHide: false,
        linkHref: link,
        linkText: 'View transaction'
      })

      // can't refresh our savings account list until we confirm transaction else required
      // fields aren't available from the blockchain yet

      try {
        log('confirming transaction', link)
        const res = await confirmTransaction(connection, txId, 'confirmed', 2)
        log('staking transaction confirmed', res)
      } catch(err) {
        if (err.timedOut) {
          log('staking transaction confirmation timed out')
        } else {
          log(`Unable to confirm staking transaction`, err)
        }
      }

      await snooze(5)

      hideDialog()
      notificationActions({ setState, getState }).hideNotification(state, notificationId)
      notificationActions({ setState, getState }).addNotification(state, {
        title: `Opened savings account!`,
        autoHide: true,
        linkHref: link,
        linkText: 'View transaction'
      })

      // update savings account list.
      // account transaction data may not be ready despite the confirmation.
      // wait a bit to allow the blockchain to update before syncing again
      await fetchSavingsAccounts({ state, setState, connection })
    } catch (err) {
      console.error(err)

      notificationActions({ setState, getState }).addNotification(state, {
        message: `An unexpected error occurred. Please try again later.`,
        title: `Error`,
        icon: ExclamationIcon,
        autoHide: true
      })

      throw err
    } finally {
      setState({ newSavingsAccountStatus: undefined })
    }
  },
  handleCloseSavingsAccount: async (state, stake) => {
    const connection = state.getWritableConnection()
    await handleCloseAccount({ state, stake, connection, setState, getState })

    // update the stakes UI
    stake.account.stakeActivation.state = 'deactivating'
    const savingsAccounts = [...getState()['savingsAccounts']]
    setState({ savingsAccounts })
  },
  handleReopenSavingsAccount: async (state, stake) => {
    const connection = state.getWritableConnection()
    await handleReopenAccount({ state, stake, connection, setState, getState })

    // update the stakes UI
    stake.account.stakeActivation.state = 'activating'
    const savingsAccounts = [...getState()['savingsAccounts']]
    setState({ savingsAccounts })
  },
  handleWithdrawSavingsAccount: async (state, stake) => {
    const connection = state.getWritableConnection()
    await handleWithdrawAccount({ state, stake, connection, setState, getState })

    // update UI
    const pubkey58 = stake.publicKey.toBase58()

    const savingsAccounts = getState()['savingsAccounts'].filter(account => {
      return account.publicKey.toBase58() !== pubkey58
    })
    setState({ savingsAccounts })
  }
})

export default actions