import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import classNames from 'classnames'

import actions from '@/actions/pools'
import { PoolsTable } from './PoolsTable'
import styles from '@/component/table/GlowTable.module.css'

export default connect(
  ({ prices, pools, hideSmallBalances }) => ({
    prices,
    pools,
    hideSmallBalances
  }),
  actions
)(({ prices, pools, listPools, hideSmallBalances }) => {
  useEffect(() => {
    listPools()
    const id = setInterval(listPools, 65000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col">
      <h1 className="ml-2.5 md:ml-0">Yield Farming</h1>
      <div className="overflow-x-auto mt-4">
        <div className="align-middle inline-block min-w-full">
          <div
            className={classNames(
              styles.glowTableWrap,
              'overflow-hidden rounded-md'
            )}
          >
            <PoolsTable
              pools={pools}
              prices={prices}
              hideSmallBalances={hideSmallBalances}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
