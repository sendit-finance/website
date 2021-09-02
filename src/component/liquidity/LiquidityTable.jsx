import Big from 'big.js'
import { useSortableData } from '@/component/table/sortable'
import { RowLiquidityToken } from './RowLiquidityToken'
import { Th } from '@/component/table/Th'

function normalizeLiquidityData(
  liquidityTokens,
  prices = {},
  hideSmallBalances
) {
  return liquidityTokens
    .map((liquidityToken) => {
      if (!liquidityToken) return

      liquidityToken = liquidityToken.normalize({
        coinPrice: prices[liquidityToken.lpCoinSymbol],
        pcPrice: prices[liquidityToken.lpPcSymbol]
      })

      if (
        hideSmallBalances &&
        liquidityToken.totalValue.toEther().toNumber() < 1
      )
        return

      return liquidityToken
    })
    .filter((liquidityToken) => !!liquidityToken)
}

const sortMap = {
  amount: (value = new Big(0)) => {
    return value.toNumber()
  },
  totalValue: (value = new Big(0)) => {
    return value.toNumber()
  }
}

export function LiquidityTable({
  liquidityTokens = [],
  prices = {},
  hideSmallBalances = false
}) {
  const normalizedLiquidityTokens = normalizeLiquidityData(
    liquidityTokens,
    prices,
    hideSmallBalances
  )

  const { items, requestSort, getSortIconFor } = useSortableData(
    normalizedLiquidityTokens,
    sortMap,
    {
      key: 'totalValue',
      direction: 'desc'
    }
  )

  return (
    <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base">
      <thead>
        <tr className="bg-gray-700 select-none">
          <Th onClick={() => requestSort('name')}>
            <span className="inline-flex">Token {getSortIconFor('name')}</span>
          </Th>
          <Th
            className="hidden sm:table-cell"
            onClick={() => requestSort('amount')}
          >
            <span className="inline-flex">
              Balance {getSortIconFor('amount')}
            </span>
          </Th>
          <Th onClick={() => requestSort('totalValue')}>
            <span className="inline-flex">
              Total {getSortIconFor('totalValue')}
            </span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {items.map((liquidityToken) => {
          if (liquidityTokens.isHidden) return null

          return <RowLiquidityToken liquidityToken={liquidityToken} />
        })}
      </tbody>
    </table>
  )
}
