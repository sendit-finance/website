import { useState, useEffect } from 'react'
import { getTokenBySymbol } from '@sendit-finance/solana-garage/util'
import TokenIcon from '../util/TokenIcon'
import styles from '@/component/table/TokenTable.module.css'
import classnames from 'classnames'
import { Td } from '@/component/table/Td'

export function RowLiquidityToken({ liquidityToken }) {
  const [coinToken, setCoinToken] = useState({})
  const [pcToken, setPcToken] = useState({})

  useEffect(async () => {
    const coinToken = await getTokenBySymbol(liquidityToken.coinSymbol)
    const pcToken = await getTokenBySymbol(liquidityToken.pcSymbol)

    setCoinToken(coinToken)
    setPcToken(pcToken)
  }, [])

  const classNames = classnames(styles.tokensTableRow, {
    [styles.tokensTableRowHighlight]:
      liquidityToken.valueChangeAmount !== undefined
  })

  return (
    <tr className={classNames} key={liquidityToken.name}>
      <Td>
        <div className="flex items-center">
          <div className="-space-x-2 hidden sm:flex w-20 lg:w-auto">
            <TokenIcon name={coinToken.name} logoURI={coinToken.logoURI} />
            <TokenIcon name={pcToken.name} logoURI={pcToken.logoURI} />
          </div>
          <div className="ml-0 sm:ml-4">
            <div className="text-sm font-medium">{liquidityToken.name}</div>
            <div className="font-medium flex items-center">
              <span className="sm:hidden break-words mr-1 mt-2">
                {liquidityToken.coinBalance.format()}{' '}
                {liquidityToken.coinSymbol} /{' '}
                {liquidityToken.pcBalance.format()} {liquidityToken.pcSymbol}
              </span>
            </div>
          </div>
        </div>
      </Td>
      <Td className="hidden sm:table-cell">
        {liquidityToken.coinBalance.format()} {liquidityToken.coinSymbol} /{' '}
        {liquidityToken.pcBalance.format()} {liquidityToken.pcSymbol}
      </Td>
      <Td>
        <div>${liquidityToken.totalValue.format()}</div>
      </Td>
    </tr>
  )
}
