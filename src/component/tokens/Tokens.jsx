import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import actions from '@/actions/tokens'
import { TokensTable } from './TokensTable'
import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'
import { ButtonHighlight } from '@/component/form/Button'

export default connect(
  ({ prices, tokens, hideSmallBalances }) => ({
    prices,
    tokens,
    hideSmallBalances
  }),
  actions
)(({ prices, tokens, hideSmallBalances }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          {tokens.length ? (
            <div
              className={classNames(
                styles.glowTableWrap,
                'overflow-hidden rounded-md'
              )}
            >
              <TokensTable
                tokens={tokens}
                prices={prices}
                hideSmallBalances={hideSmallBalances}
              />
            </div>
          ) : (
            <div className="shadow overflow-hidden rounded-md p-6 bg-gray-700">
              <p className="mb-4">You have no tokens in your wallet.</p>
              <ButtonHighlight>
                <a target="_blank" rel="noopener" href="https://ftx.com">
                  Buy some tokens now
                </a>
              </ButtonHighlight>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
