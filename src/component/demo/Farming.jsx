import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'

export default function DemoFarming() {
  return (
    <div className="flex flex-col mt-8">
      <h1 className="ml-4 md:ml-6 sm:ml-0 text-left">Yield Farming</h1>
      <div className="overflow-x-auto mt-4">
        <div className="align-middle inline-block min-w-full">
          <div
            className={classNames(
              styles.glowTableWrap,
              'overflow-hidden rounded-md'
            )}
          >
            <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base sm:rounded-m">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="cursor-pointer pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span className="inline-flex">Name </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    <span className="inline-flex">APR / APY </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    <span className="inline-flex">Staked LP </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
                  >
                    <span className="inline-flex">Pending Rewards </span>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span className="inline-flex">
                      Total
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
                        <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr/logo.png"
                            alt="Raydium"
                          />
                        </div>
                      </div>
                      <div className="ml-0 md:ml-4">
                        <div className="text-sm font-medium">RAY-USDT</div>
                        <div className="mt-2 lg:hidden">
                          Pending:
                          <div className="text-xs">
                            $1.489354
                            <br />
                            <small>(0.361494 Raydium)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    81.56% <small>APR</small>
                    <br />
                    125.86% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    1,328.068781
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div>
                      $1.489354
                      <br />
                      <small>(0.361494 Raydium)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $15,579.84
                  </td>
                </tr>
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT/logo.png"
                            alt="Step"
                          />
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
                            alt="USD Coin"
                          />
                        </div>
                      </div>
                      <div className="ml-0 md:ml-4">
                        <div className="text-sm font-medium">STEP-USDC</div>
                        <div className="mt-2 lg:hidden">
                          Pending:
                          <div className="text-xs">
                            $5.214005690
                            <br />
                            <small>(11.438487354 Step)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    336.64% <small>APR</small>
                    <br />
                    2753.14% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    762.994531361
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div>
                      $5.214005690
                      <br />
                      <small>(11.438487354 Step)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $12,762.76
                  </td>
                </tr>
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/3K6rftdAaQYMPunrtNRHgnK2UAtjm2JwyT2oCiTDouYE/logo.jpg"
                            alt="COPE"
                          />
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
                            alt="USD Coin"
                          />
                        </div>
                      </div>
                      <div className="ml-0 md:ml-4">
                        <div className="text-sm font-medium">COPE-USDC</div>
                        <div className="mt-2 lg:hidden">
                          Pending:
                          <div className="text-xs">
                            $0.712487
                            <br />
                            <small>(0.378982 COPE)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    77.07% <small>APR</small>
                    <br />
                    115.96% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    1,158.407196
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div>
                      $0.712487
                      <br />
                      <small>(0.378982 COPE)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $7,624.34
                  </td>
                </tr>
                <tr>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
                          <img
                            className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                            src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr/logo.png"
                            alt="Raydium"
                          />
                        </div>
                      </div>
                      <div className="ml-0 md:ml-4">
                        <div className="text-sm font-medium">RAY-SOL</div>
                        <div className="mt-2 lg:hidden">
                          Pending:
                          <div className="text-xs">
                            $0.000005327
                            <br />
                            <small>(0.000001293 Raydium)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    46.84% <small>APR</small>
                    <br />
                    59.69% <small>APY</small>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    0.613731
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div>
                      $0.000005327
                      <br />
                      <small>(0.000001293 Raydium)</small>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $94.53
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
