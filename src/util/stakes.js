import { ExclamationIcon } from '@heroicons/react/outline'
import { StakeProgram } from '@solana/web3.js'
import {
  createSolanaDelegateStakeTransaction
} from '@sendit-finance/solana-garage/staking'

import notificationActions from '@/actions/notification'

import debug from '@/util/log'
const log = debug.extend('util:stakes')

const signAndSendTransaction = async ({ transaction, state, connection, getState, setState }) => {
  log('signAndSendTransaction', transaction, state)

  transaction.feePayer = state.wallet.publicKey

  const { blockhash } = await connection.getRecentBlockhash()
  transaction.recentBlockhash = blockhash

  // ask for confirmation in wallet
  let signed;
  try {
    signed = await state.wallet.signTransaction(transaction)
  } catch (err) {
    if (/transaction cancelled/i.test(err.message)) {
      log('stake transaction cancelled', transaction)
      return
    }

    throw err
  }

  try {
    const txId = await connection.sendRawTransaction(
      signed.serialize()
    )

    const link = `https://explorer.solana.com/tx/${txId}`
    log('sent stake transaction', link)

    return {
      txId,
      link
    }
  } catch (err) {
    if (/blockhash not found/i.test(err)) {
      notificationActions({ setState, getState }).addNotification(state, {
        title: `Sorry, that timed out. Please try again.`,
        icon: ExclamationIcon,
        autoHide: true
      })
    }
    throw err
  }
}

export const handleCloseAccount = async ({ state, stake, connection, getState, setState }) => {
  // https://solana-labs.github.io/solana-web3.js/classes/StakeProgram.html#deactivate
  log('handleCloseAccount', state, stake)

  const authorizedPubkey = state.wallet.publicKey
  const stakePubkey = stake.publicKey
  const transaction = StakeProgram.deactivate({ authorizedPubkey, stakePubkey })

  const { link } = await signAndSendTransaction({
    transaction,
    connection,
    state,
    getState,
    setState
  })

  notificationActions({ setState, getState }).addNotification(state, {
    title: `Deactivated account`,
    autoHide: true,
    linkHref: link,
    linkText: 'View transaction'
  })
}

export const handleReopenAccount = async ({ state, stake, connection, getState, setState }) => {
  log('handleReopen', state, stake)
  // https://solana-labs.github.io/solana-web3.js/classes/StakeProgram.html#delegate

  const authorizedPubkey = state.wallet.publicKey
  const stakePubkey = stake.publicKey
  const transaction = createSolanaDelegateStakeTransaction({ authorizedPubkey, stakePubkey })

  const { link } = await signAndSendTransaction({
    transaction,
    connection,
    state,
    getState,
    setState
  })

  notificationActions({ setState, getState }).addNotification(state, {
    title: `Reopened account`,
    autoHide: true,
    linkHref: link,
    linkText: 'View transaction'
  })
}

export const handleWithdrawAccount = async ({ state, stake, connection, setState, getState }) => {
  log('handleWithdraw')
  // https://solana-labs.github.io/solana-web3.js/classes/StakeProgram.html#withdraw

  const authorizedPubkey = state.wallet.publicKey
  const stakePubkey = stake.publicKey
  const transaction = StakeProgram.withdraw({
    authorizedPubkey,
    stakePubkey,
    lamports: stake.account.lamports,
    toPubkey: authorizedPubkey
  })

  const { link } = await signAndSendTransaction({
    transaction,
    connection,
    state,
    getState,
    setState
  })

  notificationActions({ setState, getState }).addNotification(state, {
    title: `Withdrew funds and closed account`,
    autoHide: true,
    linkHref: link,
    linkText: 'View transaction'
  })
}