import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import { CurrencyDollarIcon } from '@heroicons/react/outline'
import actions from '@/actions/total-value'
import styles from '@/component/table/GlowTable.module.css'
import classNames from 'classnames'

const mapToProps = ({ totalValue }) => ({
  totalValue
})

export default connect(
  mapToProps,
  actions
)(({ totalValue, calculateTotalValue, label, wallet }) => {
  useEffect(() => {
    calculateTotalValue()
    const id = setInterval(calculateTotalValue, 2000)
    const clear = () => clearInterval(id)
    wallet?.once('disconnect', clear)
    return clear
  }, [wallet?.publicKey])
  return (
    <div
      key={label}
      className={classNames(
        styles.glowTableWrap,
        'overflow-hidden rounded-md text-gray-100'
      )}
    >
      <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full">
        <div className="p-12 flex items-center justify-center h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon
                className="h-12 w-12 text-gray-100"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 flex-1">
              <dl>
                <dt className="text-md font-medium truncate">{label}</dt>
                <dd>
                  <div className="text-4xl font-medium">
                    ${totalValue.format()}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
