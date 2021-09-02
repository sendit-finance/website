import Big from 'big.js'
import { getTotalValue, TokenAmount } from '@sendit-finance/solana-garage/util'
import debug from '@/util/log'
const log = debug.extend('actions:total-value')

function reset() {
  const totalValue = new TokenAmount(new Big(0), 2, false)
  log('resetting to 0')
  this.setState({ totalValue })
}

const actions = ({ setState }) => ({
  calculateTotalValue: async (state) => {
    log('calculate')

    state.wallet?.removeListener('disconnect', reset)
    state.wallet?.once('disconnect', reset, { setState })

    const stakes = [...state.stakes, ...state.savingsAccounts]
    setState({
      totalValue: getTotalValue({
        stakes,
        tokens: state.tokens,
        pools: state.pools,
        prices: state.prices,
        liquidityTokens: state.liquidityTokens
      })
    })
  }
})

export default actions
