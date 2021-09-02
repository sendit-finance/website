import Big from 'big.js'
import createStore from 'redux-zero'
import TokenAmount from '@sendit-finance/solana-garage/util/token-amount'

const store = createStore({
  network: 'mainnet-beta',
  connected: false,
  wallet: undefined,
  readableConnection: undefined,
  getWritableConnection: undefined,
  prices: {},
  tokens: [],
  liquidityTokens: [],
  pools: [],
  stakes: [],
  totalValue: new TokenAmount(new Big(0), 2, false),
  loadedInitialTokens: false,
  hideSmallBalances: false,
  account: undefined,
  portfolioHistory: [],
  confirmWallet: false,
  notifications: [],
  depositCurrencies: [],
  savingsAccounts: []
})

export default store
