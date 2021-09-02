import { log as debug } from '@sendit-finance/solana-garage/util'
const log = debug.extend('util:confirm-transaction')

export const confirmTransaction = async (connection, txId, commitment = 'processed', retries = 2) => {
  try {
    const res = await connection.confirmTransaction(txId, commitment)
    return res
  } catch (err) {
    if (/Transaction was not confirmed in/.test(err.message)) {
      if (retries > 0) {
        log('retrying confirmTransaction..')
        return await confirmTransaction(connection, txId, commitment, retries - 1)
      }
      err.timedOut = true
    }
    throw err
  }
}