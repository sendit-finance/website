import { getRandomConnection } from '@sendit-finance/solana-garage/util'
// wallets need this identifier
const network = 'mainnet-beta'

const getWritableConnection = () => {
  return getRandomConnection()
}

const actions = (store) => ({
  createConnection: (state) => {
    if (state.readableConnection) return

    let readableConnection

    if (typeof Proxy === 'undefined') {
      // https://caniuse.com/?search=proxy
      readableConnection = getRandomConnection()
    } else {
      readableConnection = new Proxy(
        {},
        {
          get: (target, prop, receiver) => {
            const conn = getRandomConnection()
            return conn[prop]
          }
        }
      )
    }

    return store.setState({
      readableConnection,
      getWritableConnection,
      network
    })
  }
})

export default actions
