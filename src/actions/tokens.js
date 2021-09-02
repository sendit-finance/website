import Big from 'big.js'

import { listTokenAccounts } from '@sendit-finance/solana-garage/tokens'
import { listLiquidityForTokens } from '@sendit-finance/solana-garage/liquidity'
import {
  filterTokens,
  TokenAmount,
  filterLiquidityTokens,
  log as debug
} from '@sendit-finance/solana-garage/util'

import notificationActions from './notification'

const log = debug.extend('actions:tokens')

const priceMap = new Map()
let disconnected = false

function reset() {
  disconnected = true
  log('resetting state')
  this.setState({ tokens: [] })
}

function handleTokenChangeNotification(tokens, state, getState, setState) {
  tokens.forEach((token) => {
    if (token.valueChangeAmount === undefined) return

    notificationActions({ setState, getState }).addNotification(state, {
      autoHide: true,
      title:
        token.valueChangeAmount.amount > 0
          ? `You received ${token.valueChangeAmount.format()} ${token.symbol}`
          : `You withdrew ${token.valueChangeAmount.format()} ${token.symbol}`
    })
  })
}

function normalizeTokenData(
  tokens,
  prices = {},
  hideSmallBalances = false,
  loadedInitialTokens
) {
  return tokens
    .map((token) => {
      if (!token) return

      token.price = new Big(prices[token.symbol] || 0)

      token.totalValue = new TokenAmount(
        new Big(
          token.amount ? token.amount.toEther().times(token.price) : 0
        ).times(100),
        2
      )

      token.isHidden = hideSmallBalances && token.totalValue.amount < 1

      const hasTokenPrice = priceMap.has(token.symbol)

      const isNewToken = !hasTokenPrice && loadedInitialTokens
      const isChangedToken =
        hasTokenPrice &&
        !priceMap.get(token.symbol).amount.eq(token.amount.amount)

      if (isNewToken || isChangedToken) {
        log(token.symbol, 'changed', priceMap.get(token.symbol), token.amount)
        token.valueChangeAmount = isNewToken
          ? token.amount
          : token.amount.minus(priceMap.get(token.symbol))
      } else {
        token.valueChangeAmount = undefined
      }

      priceMap.set(token.symbol, token.amount)

      return token
    })
    .filter((token) => !!token)
}

const actions = ({ setState, getState }) => ({
  getParsedTokenAccountsByOwner: async (state) => {
    if (!state.wallet.connected) return

    disconnected = false

    state.wallet?.removeListener('disconnect', reset)
    state.wallet?.once('disconnect', reset, { setState })

    const tokenAccounts = await listTokenAccounts(
      state.readableConnection,
      state.wallet.publicKey
    )

    const tokens = await filterTokens(tokenAccounts)
    const liquidityTokens = await listLiquidityForTokens(
      state.readableConnection,
      await filterLiquidityTokens(tokenAccounts)
    )

    // user may have disconnected while we were fetching tokens and accounts
    // do not display wallet state in UI if already logged out.
    if (disconnected) return

    const { prices, hideSmallBalances, loadedInitialTokens } = getState()

    const normalizedTokens = normalizeTokenData(
      tokens,
      prices,
      hideSmallBalances,
      loadedInitialTokens
    )

    handleTokenChangeNotification(normalizedTokens, state, getState, setState)

    setState({
      tokens: normalizedTokens,
      liquidityTokens: liquidityTokens,
      loadedInitialTokens: true
    })
  },
  refreshTokens: async (state) => {
    const { tokens, prices, hideSmallBalances, loadedInitialTokens } =
      getState()

    setState({
      tokens: normalizeTokenData(
        tokens,
        prices,
        hideSmallBalances,
        loadedInitialTokens
      )
    })
  }
})

export default actions
