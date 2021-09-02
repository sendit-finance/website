import debug from '@/util/log'
import tokenActions from './tokens'
import { getPrices } from '@sendit-finance/solana-garage/util'

const log = debug.extend('actions:price')

const actions = ({ setState, getState }) => ({
  getPrices: async function (state) {
    log('getPrices')

    try {
      const { tokens } = getState()
      const prices = await getPrices(tokens)

      setState({ prices })

      tokenActions({ setState, getState }).refreshTokens(state, {})
    } catch (err) {
      log('error', err)
    }
  }
})

export default actions
