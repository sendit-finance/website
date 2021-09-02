import { useEffect, useState, Fragment } from 'react'
import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'
import classnames from 'classnames'
import { Transition, Popover, Dialog } from '@headlessui/react'
import { ButtonDefault, ButtonHighlight } from '@/component/form/Button'

import networkActions from '@/actions/network'
import savingsActions from '@/actions/savings'
import StakesTable from '@/component/stakes/StakesTable'
import styles from '@/component/table/GlowTable.module.css'
import WalletConnect from '@/component/WalletConnect.jsx'
import OpenAccount from '@/component/savings/open'

export default connect(
  ({
    prices,
    savingsAccounts,
    hideSmallBalances,
    isLoadingSavings,
    connected
  }) => ({
    prices,
    savingsAccounts,
    hideSmallBalances,
    isLoadingSavings,
    connected
  }),
  combineActions(savingsActions, networkActions)
)(
  ({
    prices,
    connected,
    createConnection,
    savingsAccounts,
    hideSmallBalances,
    initializeSavingsPortfolio,
    fetchSolBalance,
    fetchSavingsAccounts,
    isLoadingSavings = true
  }) => {

    useEffect(() => {
      // TODO rename `connected` to `walletConnected` to tell difference between createConnection
      if (!connected) return

      createConnection()
      initializeSavingsPortfolio()
      fetchSolBalance()
      fetchSavingsAccounts()
      const id = setInterval(fetchSavingsAccounts, 55000)
      return () => clearInterval(id)
    }, [connected])

    if (!connected)
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="-mt-24">
            <WalletConnect className="bg-green-300 rounded-md" />
          </div>
        </div>
      )

    const [isOpenAccountShowing, setIsOpenAccountShowing] = useState(false)
    function showOpenAccount() {
      setIsOpenAccountShowing(true)
    }
    function hideOpenAccount() {
      setIsOpenAccountShowing(false)
    }

    const buttonClassNames =
      'text-white transition-colors duration-250 inline-flex justify-center px-4 py-2 text-sm font-medium ' +
      'rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-300 hover:bg-green-400 hover:text-gray-900 text-gray-900'

    return (
      <div className="flex flex-col">
        <div className="relative h-14">
          <h1 className="mt-6 ml-2.5 md:ml-0">Your SendIt Savings Accounts</h1>
          <section className="absolute top-4 right-0">

            <div>
              {(savingsAccounts.length > 0) &&
              <ButtonDefault
                onClick={showOpenAccount}
                className={classnames(buttonClassNames)}
                >
              Open new account
              </ButtonDefault>
              }
              <Transition appear show={isOpenAccountShowing}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-10 overflow-y-auto mt-16"
                  onClose={hideOpenAccount}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-95" />
                    <OpenAccount onCancel={hideOpenAccount} onComplete={hideOpenAccount}/>
                </Dialog>
              </Transition>
            </div>
          </section>
        </div>
        <div className="overflow-x-auto mt-4">
          <div className="align-middle inline-block min-w-full">
            <div
              className={classnames(
                styles.glowTableWrap,
                'overflow-hidden rounded-md'
              )}
            >
              <StakesTable
                stakes={savingsAccounts}
                prices={prices}
                hideSmallBalances={hideSmallBalances}
                isLoadingStakes={isLoadingSavings}
                isSavings={true}
                onOpenAccount={showOpenAccount}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
)
