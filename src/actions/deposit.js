import { getTokenBySymbol } from '@sendit-finance/solana-garage/util'

import debug from '@/util/log'
const log = debug.extend('actions:deposit')

const actions = ({ setState, getState }) => ({
  fetchDepositCurrencies: async function (state) {
    log('fetchDepositCurrencies')

    const depositCurrencies = [
      {
        ...(await getTokenBySymbol('USDC'))
      },
      {
        ...(await getTokenBySymbol('SOL'))
      }
    ]

    setState({ depositCurrencies })
  }
})

export default actions