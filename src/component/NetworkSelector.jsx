import { connect } from 'redux-zero/react'
import networkAction from '@/actions/network'

const mapToProps = ({ network }) => ({ network })

export default connect(
  mapToProps,
  networkAction
)(({ network, setNetwork }) => {
  return (
    <div>
      <select
        id="network"
        name="network"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-green-300 focus:border-green-300 sm:text-sm rounded-md text-gray-100 bg-gray-800"
        defaultValue={network}
        onChange={(e) => {
          const el = e.target
          setNetwork(el.options[el.selectedIndex].value)
        }}
      >
        <option value="mainnet-beta">mainnet-beta</option>
        <option value="testnet">testnet</option>
        <option value="devnet">devnet</option>
        <option value="localnet">localnet</option>
      </select>
    </div>
  )
})
