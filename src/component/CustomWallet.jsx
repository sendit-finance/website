import { connect } from 'redux-zero/react'
import { useRouter } from 'next/router'
import settingsActions from '@/actions/settings'

export default connect(
  ({ hideSmallBalances }) => ({ hideSmallBalances }),
  settingsActions
)(({}) => {
  const router = useRouter()

  function onKeyDown(e) {
    if (e.key !== 'Enter') return

    router.push({
      pathname: window.location.pathname,
      query: { wallet: e.target.value }
    })
  }
  return (
    <label className="whitespace-nowrap  flex items-center">
      <input
        type="text"
        onKeyDown={onKeyDown}
        placeholder="Enter any Solana Address"
        className="block w-full pl-3 pr-3 py-2 text-base focus:outline-none focus:ring-green-300 focus:border-green-300 sm:text-sm rounded-md text-gray-100 bg-gray-800"
      />
    </label>
  )
})
