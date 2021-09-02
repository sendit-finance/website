import { listStakes } from '@sendit-finance/solana-garage/staking'
import {
  handleReopenAccount,
  handleWithdrawAccount,
  handleCloseAccount
} from '@/util/stakes'

import debug from '@/util/log'
const log = debug.extend('actions:stakes')

/**
 * We store the results of our staking requests in `results`.
 * There are three types of staking results:
 *   1. Raydium
 *   2. Solana
 *   3. Solflare (a custom Solana stake)
 *
 * results Map<string, Map>
 */
let results = new Map()

/**
 * Tracks loading state
 */
let isLoadingStakes = false

/**
 * Fetching stakes takes a while. During the fetch, the customer may log out. If
 * they are logged out during stake fetching we don't want to set state which
 * could cause the UI to render results which breaks the logged out experience.
 */
function disconnect() {
  log('resetting state')

  results = new Map()
  isLoadingStakes = false

  this.stop()
  this.setState({ stakes: [], isLoadingStakes })
}

const refreshStakes = (setState) => {
  const stakes = [...results.values()] // [Map, Map, Map]
    .map((m) => [...m.values()]) // [[Stake, Stake], [Stake], [Stake]]
    .flat() // [Stake, Stake, Stake, Stake]

  setState({ stakes })
}

const actions = ({ getState, setState }) => ({
  listStakes: async (state) => {
    log('listStakes')

    const wallet = state.wallet
    if (!(wallet && state.readableConnection && state.connected)) return
    //
    isLoadingStakes = true
    setState({ isLoadingStakes })

    const stakeEmitter = listStakes({
      connection: state.readableConnection,
      publicKey: state.wallet.publicKey
    })

    /**
     * Fetching stakes takes a while. During the fetch, the customer may log out. If
     * they are logged out during stake fetching we don't want to set state which
     * could cause the UI to render results which breaks the logged out experience.
     */
    wallet.removeListener('disconnect', disconnect)
    wallet.once('disconnect', disconnect, {
      setState,
      stop: () => {
        stakeEmitter.stop()
      }
    })

    stakeEmitter.on('stake', (stake = {}) => {
      log('stake', stake)

      if (!stake.publicKey) {
        // developer error. throw so they fix it locally
        throw new Error('Stake is missing public key')
      }

      const { type } = stake
      if (!results.has(type)) {
        results.set(type, new Map())
      }

      // Upsert the items
      const map = results.get(type)
      map.set(stake.publicKey.toBase58(), stake)

      refreshStakes(setState)
    })

    stakeEmitter.once('complete', () => {
      isLoadingStakes = false
      setState({ isLoadingStakes })
      log('stake emitter complete')
    })
  },
  handleCloseStakeAccount: async (state, stake) => {
    await handleCloseAccount({ state, stake, setState, getState })

    // update the stakes UI
    stake.account.stakeActivation.state = 'deactivating'
    refreshStakes(setState)
  },
  handleReopenStakeAccount: async (state, stake) => {
    await handleReopenAccount({ state, stake, setState, getState })

    // update the stakes UI
    stake.account.stakeActivation.state = 'active'
    refreshStakes(setState)
  },
  handleWithdrawStakeAccount: async (state, stake) => {
    await handleWithdrawAccount({ state, stake, setState, getState })

    // update UI
    const map = results.get(stake.type)
    map.delete(stake.publicKey.toBase58())
    refreshStakes(setState)
  }
})

export default actions
