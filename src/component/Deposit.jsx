import { useState, useEffect, Fragment } from 'react'
import { connect } from 'redux-zero/react'
import { usePopper } from 'react-popper'
import classnames from 'classnames'
import { Transition, Popover } from '@headlessui/react'
import TokenIcon from './util/TokenIcon'
import depositActions from '@/actions/deposit'

function openFtxPay(token, address) {
  window.open(
    `https://ftx.com/pay/request?coin=${token}&address=${address}&tag=&wallet=sol&memoIsRequired=false`,
    '_blank',
    'resizable,width=450,height=780'
  )
}

const mapToProps = ({
  wallet,
  connected,
  depositCurrencies,
  fetchDepositCurrencies
}) => ({
  wallet,
  connected,
  depositCurrencies,
  fetchDepositCurrencies
})

export default connect(mapToProps, depositActions)(({
  wallet,
  connected,
  className,
  fetchDepositCurrencies,
  depositCurrencies
}) => {
  if (!connected) return null

  useEffect(() => {
    fetchDepositCurrencies()
  }, [])

  let [referenceElement, setReferenceElement] = useState()
  let [popperElement, setPopperElement] = useState()

  let { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-end',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [1, 6]
          }
        }
      ]
    }
  )

  const publicKey = wallet.publicKey.toBase58()
  const buttonClassNames =
    'text-white transition-colors duration-250 inline-flex justify-center w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-300 hover:bg-green-400 hover:text-gray-900 text-gray-900'

  return (
    <Popover as={Fragment}>
      {({ open }) => (
        <>
          <Popover.Button
            ref={setReferenceElement}
            className={classnames(
              {
                'text-opacity-90': !open
              },
              buttonClassNames,
              className
            )}
          >
            <span>Deposit</span>
          </Popover.Button>
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="z-20"
          >
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              beforeEnter={() => update()}
            >
              <Popover.Panel static>
                <div className="border-green-400 border-2 border-solid bg-gray-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-6 bg-gray-700 rounded-lg">
                    <span className="block text-sm text-gray-100">
                      Deposit tokens from FTX
                    </span>
                  </div>
                  <div className="relative grid gap-8 p-7 lg:grid-cols-1">
                    {depositCurrencies.map((token) => {
                      const classNames = classnames(
                        'flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                      )
                      return (
                        <a
                          onClick={() => {
                            referenceElement.click()
                            openFtxPay(token.symbol, publicKey)
                          }}
                          href="##"
                          key={token.symbol}
                          className={classNames}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                            <TokenIcon
                              name={token.name}
                              logoURI={token.logoURI}
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-100">
                              {token.symbol}
                            </p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        </>
      )}
    </Popover>
  )
})
