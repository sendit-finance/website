import Big from 'big.js'

import { useSortableData } from '@/component/table/sortable'
import RowFusionPool from './RowFusionPool'
import RowFarm from './RowFarm'
import { TokenAmount } from '@sendit-finance/solana-garage/util'

import { FusionPool } from '@sendit-finance/solana-garage/farms/fusion'
import { Farm } from '@sendit-finance/solana-garage/farms/farm'

import { ButtonHighlight } from '@/component/form/Button'
import { Th } from '@/component/table/Th'

function getTokenAmountValue(item) {
  if (!item) return 0
  if (!item instanceof TokenAmount) return 0
  return item.toEther().toNumber()
}

const sortMap = {
  totalValue: getTokenAmountValue,
  totalApr: (value = new Big(0)) => {
    return value.toNumber()
  },
  stakedLpTokens: getTokenAmountValue,
  totalPendingRewardValue: getTokenAmountValue,
  totalValue: getTokenAmountValue
}

function normalizePoolData(pools, prices = {}, hideSmallBalances) {
  return pools
    .map((pool) => {
      if (!pool) return

      const [coin, pc] = pool.name.split('-')
      if (pool instanceof FusionPool || pool instanceof Farm) {
        pool = pool.normalize({ coinPrice: prices[coin], pcPrice: prices[pc] })
        if (hideSmallBalances && pool.totalValue.toEther().toNumber() < 1)
          return

        return pool
      }
    })
    .filter((pool) => !!pool)
}

export function PoolsTable({
  pools = [],
  prices = {},
  hideSmallBalances = false
}) {
  pools = normalizePoolData(pools, prices, hideSmallBalances)

  const { items, requestSort, getSortIconFor } = useSortableData(
    pools,
    sortMap,
    {
      key: 'totalValue',
      direction: 'desc'
    }
  )

  if (!pools.length)
    return (
      <div className="shadow overflow-hidden sm:rounded-md p-6 bg-gray-700">
        <p className="mb-4">You are not farming any tokens yet.</p>
        <ButtonHighlight>
          <a target="_blank" rel="noopener" href="https://raydium.io/farms/">
            Start farming now
          </a>
        </ButtonHighlight>
      </div>
    )

  return (
    <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base sm:rounded-m">
      <thead className="bg-gray-700 select-none">
        <tr>
          <Th onClick={() => requestSort('name')}>
            <span className="inline-flex">Name {getSortIconFor('name')}</span>
          </Th>
          <Th
            className="hidden lg:table-cell"
            onClick={() => requestSort('totalApr')}
          >
            <span className="inline-flex">
              APR / APY {getSortIconFor('totalApr')}
            </span>
          </Th>
          <Th
            className="hidden lg:table-cell"
            onClick={() => requestSort('stakedLpTokens')}
          >
            <span className="inline-flex">
              Staked {getSortIconFor('stakedLpTokens')}
            </span>
          </Th>
          <Th
            className="hidden lg:table-cell"
            onClick={() => requestSort('totalPendingRewardValue')}
          >
            <span className="inline-flex">
              Rewards {getSortIconFor('totalPendingRewardValue')}
            </span>
          </Th>
          <Th onClick={() => requestSort('totalValue')}>
            <span className="inline-flex">
              Total {getSortIconFor('totalValue')}
            </span>
          </Th>
        </tr>
      </thead>
      <tbody className="bg-gray-700">
        {items.map((pool) => {
          if (!pool) return

          switch (pool.type) {
            case 'FusionPool':
              return <RowFusionPool key={pool.poolId} pool={pool} />
            case 'Farm':
              return <RowFarm key={pool.poolId} pool={pool} />
          }
        })}
      </tbody>
    </table>
  )
}
