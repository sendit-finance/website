import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'

export default function DemoStaking() {
  return (
    <div className="flex flex-col mt-8">
      <h1 className="ml-4 md:ml-6 sm:ml-0">Staking</h1>
      <div className="overflow-x-auto mt-4">
        <div className="align-middle inline-block min-w-full">
          <div
            className={classNames(
              styles.glowTableWrap,
              'overflow-hidden rounded-md'
            )}
          >
            <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base sm:rounded-md">
              <thead className="bg-gray-700 select-none">
                <tr>
                  <th
                    scope="col"
                    className="cursor-pointer pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span className="inline-flex">Name </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span className="inline-flex">APR / APY </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    <span className="inline-flex">Staked </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    <span className="inline-flex">Rewards </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span className="inline-flex">
                      Total{' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 ml-2"
                      >
                        <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path>
                      </svg>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700">
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden sm:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png"
                            alt="Wrapped SOL"
                          />
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="text-sm font-medium">SOL</div>
                        <div className="lg:hidden mt-2">
                          Rewards:{' '}
                          <div className="text-xs">
                            $170.42 Earned
                            <br />
                            <small>(6.088 Solana)</small>
                          </div>
                        </div>
                        <div className="lg:hidden mt-2">
                          Staked:<div>116.2143</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    6.60% <small>APR</small>
                    <br />
                    6.82% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    116.2143
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="">
                      $170.42 Earned
                      <br />
                      <small>(6.088 Solana)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $3,229.59
                  </td>
                </tr>
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden sm:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr/logo.png"
                            alt="Raydium"
                          />
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="text-sm font-medium">RAY</div>
                        <div className="lg:hidden mt-2">
                          Rewards:{' '}
                          <div className="text-xs">
                            $0.0985 Pending
                            <br />
                            <small>(0.031895 Raydium)</small>
                          </div>
                        </div>
                        <div className="lg:hidden mt-2">
                          Staked:<div>1</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    30.21% <small>APR</small>
                    <br />
                    35.25% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    1
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="">
                      $0.098557 Pending
                      <br />
                      <small>(0.031895 Raydium)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">$3.09</td>
                </tr>
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden sm:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png"
                            alt="Wrapped SOL"
                          />
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="text-sm font-medium">SOL</div>
                        <div className="lg:hidden mt-2">
                          Rewards:{' '}
                          <div className="text-xs">
                            $0.00 Earned
                            <br />
                            <small>(0.000002829 Solana)</small>
                          </div>
                        </div>
                        <div className="lg:hidden mt-2">
                          Staked:<div>0.0030</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    1.50% <small>APR</small>
                    <br />
                    1.51% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    0.0030
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="">
                      $0.00 Earned
                      <br />
                      <small>(0.000002829 Solana)</small>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">$0.09</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
