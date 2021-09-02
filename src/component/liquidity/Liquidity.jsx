import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import actions from '@/actions/tokens'
import { LiquidityTable } from './LiquidityTable'
import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'
import { ButtonHighlight } from '@/component/form/Button'

export default connect(
  ({ prices, liquidityTokens, hideSmallBalances }) => ({
    prices,
    liquidityTokens,
    hideSmallBalances
  }),
  actions
)(({ prices, liquidityTokens, hideSmallBalances }) => {
  if (!liquidityTokens.length) return null
  return (
    <div className="flex flex-col">
      <h1 className="ml-2.5 md:ml-0">Liquidity</h1>
      <div className="overflow-x-auto mt-4">
        <div className="align-middle inline-block min-w-full">
          <div
            className={classNames(
              styles.glowTableWrap,
              'overflow-hidden rounded-md'
            )}
          >
            <LiquidityTable
              liquidityTokens={liquidityTokens}
              prices={prices}
              hideSmallBalances={hideSmallBalances}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
