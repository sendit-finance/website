import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import classNames from 'classnames'

import actions from '@/actions/stakes'
import StakesTable from './StakesTable'
import styles from '@/component/table/GlowTable.module.css'

export default connect(
  ({ prices, stakes, hideSmallBalances, isLoadingStakes }) => ({
    prices,
    stakes,
    hideSmallBalances,
    isLoadingStakes
  }),
  actions
)(
  ({
    prices,
    stakes,
    listStakes,
    hideSmallBalances,
    isLoadingStakes = true
  }) => {
    useEffect(() => {
      listStakes()
      const id = setInterval(listStakes, 180000)
      return () => clearInterval(id)
    }, [])

    return (
      <div className="flex flex-col">
        <h1 className="ml-2.5 md:ml-0">Staking</h1>
        <div className="overflow-x-auto mt-4">
          <div className="align-middle inline-block min-w-full">
            <div
              className={classNames(
                styles.glowTableWrap,
                'overflow-hidden rounded-md'
              )}
            >
              <StakesTable
                stakes={stakes}
                prices={prices}
                hideSmallBalances={hideSmallBalances}
                isLoadingStakes={isLoadingStakes}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)
