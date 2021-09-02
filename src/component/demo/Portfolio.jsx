import getFakeData from '@/util/get-fake-data'
import LineChart from '@/component/chart/LineChart'
import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'

export default function DemoPortfolio() {
  const data = getFakeData()
  const netWorth = data[data.length - 1]?.y?.toLocaleString('en-US', {maximumFractionDigits:2})
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className={classNames(
          styles.glowTableWrap,
          'overflow-hidden rounded-md text-gray-100'
        )}
      >
        <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full relative">
          <div className="p-12 flex items-center justify-center h-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-12 w-12 text-gray-100"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-5 flex-1">
                <dl>
                  <dt className="text-md font-medium truncate">Net worth</dt>
                  <dd>
                    <div className="text-4xl font-medium">${netWorth}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="GlowTable_glowTableWrap__qN8mP bg-gray-700 overflow-hidden rounded-md text-gray-100">
        <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full">
          <div className="items-center justify-content grid gap-4">
            <div className="p-4">
              <LineChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
