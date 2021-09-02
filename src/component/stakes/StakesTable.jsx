import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'
import Big from 'big.js'
import { useSortableData } from '@/component/table/sortable'
import { TokenAmount } from '@sendit-finance/solana-garage/util'
import RowStake from './RowStake'
import { ButtonHighlight } from '@/component/form/Button'
import { Th } from '@/component/table/Th'
import Disclaimer from '@/component/savings/disclaimer'
import stakeActions from '@/actions/stakes'
import savingsActions from '@/actions/savings'

function getTokenAmountValue(item) {
  if (!(item instanceof TokenAmount)) return item
  return item.toEther().toNumber()
}

const sortMap = {
  totalValue: getTokenAmountValue,
  apr: (value = new Big(0)) => {
    return value.toNumber()
  },
  depositBalance: getTokenAmountValue,
  rewardValue: getTokenAmountValue,
  totalValue: getTokenAmountValue
}

function normalizeStakeData(stakes, prices = {}, hideSmallBalances) {
  return stakes
    .map((stake) => {
      if (!stake) return

      stake = stake.normalize({ coinPrice: prices[stake.name] })

      if (hideSmallBalances && stake.totalValue.toEther().toNumber() < 1) return

      return stake
    })
    .filter(Boolean)
}

const mapToProps = ({
  handleCloseSavingsAccount,
  handleCloseStakeAccount,
  handleReopenSavingsAccount,
  handleReopenStakeAccount,
  handleWithdrawSavingsAccount,
  handleWithdrawStakeAccount
}) => ({
  handleCloseSavingsAccount,
  handleCloseStakeAccount,
  handleReopenSavingsAccount,
  handleReopenStakeAccount,
  handleWithdrawSavingsAccount,
  handleWithdrawStakeAccount
})

export default connect(
  mapToProps,
  combineActions(stakeActions, savingsActions)
)(({
  handleCloseSavingsAccount,
  handleCloseStakeAccount,
  handleReopenSavingsAccount,
  handleReopenStakeAccount,
  handleWithdrawSavingsAccount,
  handleWithdrawStakeAccount,
  stakes = [],
  prices = {},
  hideSmallBalances,
  isLoadingStakes,
  isSavings = false,
  onOpenAccount = () => {}
}) => {
  stakes = normalizeStakeData(stakes, prices, hideSmallBalances)

  const { items, requestSort, getSortIconFor } = useSortableData(
    stakes,
    sortMap,
    { key: 'totalValue', direction: 1 }
  )

  if (!stakes.length && isLoadingStakes)
    return (
      <div className="shadow overflow-hidden sm:rounded-md p-6 bg-gray-700">
        <p className="animate-pulse">Loading accounts...</p>
      </div>
    )

  if (!stakes.length && !isLoadingStakes && isSavings)
    return (
      <>
        <div className="shadow overflow-hidden sm:rounded-md p-6 bg-gray-700 justify-center text-center">
          <p className="md:mt-6 text-lg mt-1 mb-10">
            You have not yet opened a SendIt Savings Account. Get started earning up to 6% APY* on Solana today.
          </p>
          <ButtonHighlight
            onClick={onOpenAccount}
          >
            <span>
              Open SendIt Savings Account
            </span>
          </ButtonHighlight>
        <Disclaimer/>
        </div>
      </>
    )

  if (!stakes.length && !isLoadingStakes)
    return (
      <div className="shadow overflow-hidden sm:rounded-md p-6 bg-gray-700">
        <p className="mb-4">
          You are not earning any rewards by staking $RAY yet.
        </p>
        <ButtonHighlight>
          <a target="_blank" rel="noopener" href="https://raydium.io/staking/">
            Start staking $RAY now
          </a>
        </ButtonHighlight>
      </div>
    )

  const onCloseAccount = isSavings ? handleCloseSavingsAccount : handleCloseStakeAccount
  const onReopenAccount = isSavings ? handleReopenSavingsAccount : handleReopenStakeAccount
  const onWithdrawAccount = isSavings ? handleWithdrawSavingsAccount : handleWithdrawStakeAccount

  return (
    <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base sm:rounded-md">
      <thead className="bg-gray-700 select-none">
        <tr>
          <Th onClick={() => requestSort('name')}>
            <span className="inline-flex">Name {getSortIconFor('name')}</span>
          </Th>
          <Th onClick={() => requestSort('apr')}>
            <span className="inline-flex">
              APR / APY {getSortIconFor('apr')}
            </span>
          </Th>
          <Th
            className="hidden lg:table-cell"
            onClick={() => requestSort('depositBalance')}
          >
            <span className="inline-flex">
              Staked {getSortIconFor('depositBalance')}
            </span>
          </Th>
          <Th
            className="hidden lg:table-cell"
            onClick={() => requestSort('rewardValue')}
          >
            <span className="inline-flex">
              Rewards {getSortIconFor('rewardValue')}
            </span>
          </Th>
          <Th onClick={() => requestSort('totalValue')}>
            <span className="inline-flex">
              Total {getSortIconFor('totalValue')}
            </span>
          </Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody className="bg-gray-700">
        {items.map((stake, i) => {
          if (!stake) return
          return <RowStake
            key={stake.name + '-' + i}
            stake={stake}
            onCloseAccount={onCloseAccount}
            onReopenAccount={onReopenAccount}
            onWithdrawAccount={onWithdrawAccount}
          />
        })}
        {isLoadingStakes && (
          <tr>
            <td
              colSpan="5"
              className="px-6 py-4 whitespace-nowrap animate-pulse"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="overflow-hidden sm:rounded-md p-6 bg-gray-700">
                    <p className="">Loading accounts...</p>
                  </div>
                </div>
              </div>
            </td>
            <td></td>
          </tr>
        )}
      </tbody>
    </table>
  )
})
