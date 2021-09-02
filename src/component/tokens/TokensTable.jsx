import Big from 'big.js'
import classnames from 'classnames'
import { useSortableData } from '@/component/table/sortable'
import TokenIcon from '../util/TokenIcon'
import styles from '@/component/table/TokenTable.module.css'
import { Td } from '@/component/table/Td'
import { Th } from '@/component/table/Th'

function getTokenName(token) {
  if (token.isUnknown) {
    return (
      <span>
        Unknown Token
        <br />
        <small>
          ...
          {token.address.substr(token.address.length - 5, token.address.length)}
        </small>
      </span>
    )
  }
  return <span>{token.symbol}</span>
}

const sortMap = {
  amount: (value = new Big(0)) => {
    return value.toNumber()
  },
  price: (value = new Big(0)) => {
    return value.toNumber()
  },
  totalValue: (value = new Big(0)) => {
    return value.toNumber()
  }
}

export function TokensTable({ tokens = [] }) {
  const { items, requestSort, getSortIconFor } = useSortableData(
    tokens,
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
          <Th scope="col" onClick={() => requestSort('price')}>
            <span className="inline-flex">Price {getSortIconFor('price')}</span>
          </Th>
          <Th scope="col" onClick={() => requestSort('totalValue')}>
            <span className="inline-flex">
              Total {getSortIconFor('totalValue')}
            </span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {items.map((token) => {
          if (token.isHidden) return

          const classNames = classnames(styles.tokensTableRow, {
            [styles.tokensTableRowHighlight]:
              token.valueChangeAmount !== undefined
          })

          return (
            <tr className={classNames} key={token.name}>
              <Td>
                <div className="flex items-center">
                  <div className="leading-none hidden sm:block w-8 md:w-auto">
                    <TokenIcon name={token.name} logoURI={token.logoURI} />
                  </div>
                  <div className="ml-0 sm:ml-4">
                    <div className="font-medium flex items-center">
                      <a
                        href={`https://explorer.solana.com/address/${token.address}`}
                        rel="noopener"
                        target="_blank"
                      >
                        <span className="sm:hidden break-words mr-1">
                          {token.amount.format()}
                        </span>
                        {getTokenName(token)}
                      </a>
                    </div>
                  </div>
                </div>
              </Td>
              <Td className="hidden sm:table-cell">{token.amount.format()}</Td>
              <Td>${token.price.toFixed(2)}</Td>
              <Td>
                <div>${token.totalValue.format()}</div>
              </Td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
