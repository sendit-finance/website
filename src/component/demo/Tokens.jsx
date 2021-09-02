import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'

export default function DemoTokens() {
  return (
    <div className="flex flex-col mt-8">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div
            className={classNames(
              styles.glowTableWrap,
              'overflow-hidden rounded-md'
            )}
          >
            <table className="min-w-full text-gray-100 text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-700">
                  <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  >
                    <span className="inline-flex">Token </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                  >
                    <span className="inline-flex">Balance </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  >
                    <span className="inline-flex">Price </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
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
                <tr className="TokensTable_tokensTableRow__3rL-e">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="leading-none hidden sm:block w-8 md:w-auto">
                        <img
                          className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                          src="https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png"
                          alt="Wrapped SOL"
                        />
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="font-medium flex items-center">
                          <a
                            href="https://explorer.solana.com/address/So11111111111111111111111111111111111111112"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="sm:hidden break-words">
                              5.0259
                            </span>
                            <span>SOL</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    5.025862727
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    $40.78
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>$204.95</div>
                  </td>
                </tr>
                <tr className="TokensTable_tokensTableRow__3rL-e">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="leading-none hidden sm:block w-8 md:w-auto">
                        <img
                          className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                          src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr/logo.png"
                          alt="Raydium"
                        />
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="font-medium flex items-center">
                          <a
                            href="https://explorer.solana.com/address/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="sm:hidden break-words">
                              45.7729
                            </span>
                            <span>RAY</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    45.772862
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">$4.12</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>$188.58</div>
                  </td>
                </tr>
                <tr className="TokensTable_tokensTableRow__3rL-e">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="leading-none hidden sm:block w-8 md:w-auto">
                        <img
                          className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                          src="https://cdn.jsdelivr.net/gh/dr497/awesome-serum-markets/icons/fida.svg"
                          alt="Bonfida"
                        />
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="font-medium flex items-center">
                          <a
                            href="https://explorer.solana.com/address/EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="sm:hidden break-words">
                              50.2259
                            </span>
                            <span>FIDA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    50.225921
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">$2.14</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>$107.48</div>
                  </td>
                </tr>
                <tr className="TokensTable_tokensTableRow__3rL-e">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="leading-none hidden sm:block w-8 md:w-auto">
                        <img
                          className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                          src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/3K6rftdAaQYMPunrtNRHgnK2UAtjm2JwyT2oCiTDouYE/logo.jpg"
                          alt="COPE"
                        />
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="font-medium flex items-center">
                          <a
                            href="https://explorer.solana.com/address/8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="sm:hidden break-words">
                              21.1364
                            </span>
                            <span>COPE</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    21.136416
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">$1.88</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>$39.74</div>
                  </td>
                </tr>
                <tr className="TokensTable_tokensTableRow__3rL-e">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="leading-none hidden sm:block w-8 md:w-auto">
                        <img
                          className="h-5 w-5 md:h-10 md:w-10 rounded-full bg-gray-800 inline-block"
                          src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
                          alt="USD Coin"
                        />
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <div className="font-medium flex items-center">
                          <a
                            href="https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                            rel="noopener"
                            target="_blank"
                          >
                            <span className="sm:hidden break-words">
                              2.9700
                            </span>
                            <span>USDC</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    2.97
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">$1.00</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>$2.97</div>
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
