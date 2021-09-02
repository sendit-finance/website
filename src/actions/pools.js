import { listFarms } from '@sendit-finance/solana-garage/farms'
import debug from '@/util/log'
const log = debug.extend('actions:pools')

let disconnected = false

function reset() {
  disconnected = true
  log('resetting state')
  this.setState({ pools: [] })
}

const actions = ({ setState }) => ({
  listPools: async (state) => {
    disconnected = false
    state.wallet?.removeListener('disconnect', reset)
    state.wallet?.once('disconnect', reset, { setState })

    const pools = await listFarms(
      state.readableConnection,
      state.wallet.publicKey.toBase58()
    )

    if (disconnected) return

    setState({
      pools
    })
  }
})

export default actions
