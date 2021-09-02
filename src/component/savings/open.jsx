import React, { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'
import WalletConnect from '@/component/WalletConnect.jsx'
import networkActions from '@/actions/network'
import tokenActions from '@/actions/tokens'
import savingsActions from '@/actions/savings'
import TokenIcon from '@/component/util/TokenIcon'
import classNames from 'classnames'
import styles from '@/component/table/GlowTable.module.css'
import { ButtonHighlight, ButtonDefault } from '@/component/form/Button'
import { ExclamationIcon } from '@heroicons/react/outline'

const mapToProps = ({
  network,
  connected,
  fetchSolBalance,
  solBalance,
  handleAmountChange,
  handleSubmit,
  newSavingsAccountStatus
  }) => ({
  network,
  connected,
  solBalance,
  fetchSolBalance,
  handleAmountChange,
  handleSubmit,
  newSavingsAccountStatus
})

export default connect(
  mapToProps,
  combineActions(networkActions, tokenActions, savingsActions)
)(({
  connected,
  fetchSolBalance,
  solBalance,
  handleAmountChange,
  newSavingsAccountStatus,
  handleOpenAccount,
  onCancel = (e) => {e.preventDefault()},
  onComplete
  }) => {

  useEffect(() => {
    if (!connected) return
    fetchSolBalance()
    const id = setInterval(fetchSolBalance, 120000)
    return () => clearInterval(id)
  }, [connected])

  const handleSubmit = (evt) => {
    evt.preventDefault()
    handleOpenAccount(evt, onComplete)
  }

  const handleAmountKeyPress = (evt) => {
    const newChar = evt.key

    // allow only digits and periods
    if (!/[\d\.]/.test(newChar)) {
      evt.preventDefault()
      return
    }

    // allow only valid decimals
    const newValueStr = `${evt.target.value}${newChar}`
    if (!/^\d+\.?\d*$/.test(newValueStr) && !/^.\d*$/.test(newValueStr)) {
      evt.preventDefault()
      return
    }
  }

  function notConnected () {
    return (
      <div>
        <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-10 lg:mt-6 lg:text-5xl xl:text-6xl text-center">
          <span className="text-green-300">SendIt Savings</span>
        </h1>
        <div>
        <section className="justify-center text-center">
          <div className="px-32 mt-4">
            Please first login to open a SendIt Savings Account
            <WalletConnect className="bg-green-300 rounded-md w-36 mt-4" />
          </div>
        </section>
        </div>
      </div>
    )
  }

  function lessThanMinimumBalance() {
    return (
      <div
        className={classNames(
          styles.glowTableWrap,
          'overflow-hidden rounded-md text-gray-100'
        )}
      >
        <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full relative">
          <div className="p-12 flex items-center justify-center h-full">
            <div className="flex items-center"></div>
            <section className="">
              <section className="justify-center text-center">
                <div className="w-80">
                  <ExclamationIcon className="text-green-300 center w-10 inline-block"/>
                  <p className="mt-5">
                    You don't have enough SOL {'(< 0.003)'} to open a SendIt Savings Account.
                  </p>
                  <p className="mt-5 text-sm text-gray-300">
                    The easist way to get SOL into your wallet is to buy it on
                    <a target="_blank" className="underline pl-1" href="https://ftx.com">FTX</a> and then
                    click on our "Deposit" button at the top of the page.
                    Otherwise you can find SOL available on
                    <a target="_blank" className="underline pl-1" href="https://raydium.io/swap/?ammId=58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2">Raydium</a>,
                    <a target="_blank" className="underline pl-1" href="https://www.coinbase.com/">Coinbase</a> or other public markets.
                  </p>
                  <ButtonDefault
                    className="mt-6"
                    onClick={(e) => {
                      onCancel(e)
                      e.preventDefault()
                    }}
                  >
                    <span>Close</span>
                  </ButtonDefault>
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    )
  }

  function openAccount () {
    const opening = newSavingsAccountStatus === 'opening'

    return (
      <div
        className={classNames(
          styles.glowTableWrap,
          'overflow-hidden rounded-md text-gray-100'
        )}
      >
        <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full relative">
        <div className="p-12 flex items-center justify-center h-full">
          <div className="flex items-center"></div>
            <section className="">
              <h1 className="mt-1 text-1xl tracking-tight font-extrabold text-white sm:mt-1 sm:leading-10 md:text-xl lg:mt-1 lg:text-2xl">
                <TokenIcon
                  name={solBalance?.symbol}
                  logoURI={solBalance?.logoURI}
                />
                <span className="pl-2">Open a Solana Savings Account</span>
              </h1>
              <section className="justify-center text-center">
                <form
                  id="create-stake-form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <div className="grid grid-cols-2 gap-3 text-left mt-4 flex items-center">
                    <div className="flex items-center">
                      <div>
                        <span>Current SOL Balance</span>
                      </div>
                    </div>
                    <div>
                      {solBalance?.amount?.fixed() || 'loading..'}
                    </div>
                    <div>
                      <label htmlFor="stake-amount">Stake amount</label>
                    </div>
                    <div>
                      <input
                        className="text-black rounded"
                        id="stake-amount"
                        name="stake-amount"
                        placeholder=" Enter amount"
                        onKeyPress={handleAmountKeyPress}
                        onChange={handleAmountChange}
                      ></input>
                    </div>
                      <div>
                        <div className={classNames(
                          opening ? "bg-gray-600": "bg-green-300",
                          "rounded-md justify-center inline-block"
                          )}>
                          <ButtonHighlight
                            form="create-stake-form"
                            disabled={opening ? 'disabled': ''}
                          >
                            {opening &&
                              (
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              )
                            }
                            <span>Open Account</span>
                          </ButtonHighlight>
                        </div>
                      </div>
                      <div>
                        <ButtonDefault
                          disabled={opening ? 'disabled': ''}
                          onClick={(e) => {
                            onCancel(e)
                            e.preventDefault()
                          }}
                        >
                          <span>Cancel</span>
                        </ButtonDefault>
                      </div>
                  </div>
                </form>
              </section>
            </section>
          </div>
        </div>
      </div>
    )
  }

  const view = !connected ? notConnected :
    (!solBalance || solBalance.amount?.amount?.isLessThan(0.003)) ? lessThanMinimumBalance :
    openAccount;

  return (
    <div className="flex-1 flex items-center justify-center">
      {(view())}
    </div>
  )
})