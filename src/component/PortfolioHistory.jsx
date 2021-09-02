import { useEffect } from 'react'
import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'
import accountActions from '@/actions/account'
import walletActions from '@/actions/wallet'
import styles from '@/component/table/GlowTable.module.css'
import classNames from 'classnames'
import getFakeData from '../util/get-fake-data'
import LineChart from './chart/LineChart'
import { ButtonHighlight } from '@/component/form/Button'

const mapToProps = ({ account, wallet, portfolioHistory }) => ({
  account,
  wallet,
  portfolioHistory
})

export default connect(
  mapToProps,
  combineActions(walletActions, accountActions)
)(
  ({
    account,
    getAccount,
    getPortfolioValue,
    createAccount,
    wallet,
    portfolioHistory,
    connectWallet
  }) => {
    useEffect(() => {
      if (!wallet.supportsEncryptDecrypt) return
      getAccount()
    }, [wallet.supportsEncryptDecrypt])

    useEffect(() => {
      if (!account) return
      if (!wallet.supportsEncryptDecrypt) return
      getPortfolioValue(true)
    }, [account, wallet.supportsEncryptDecrypt])

    let content
    if (!account && wallet.supportsEncryptDecrypt) {
      content = (
        <div className="p-5">
          <div className="items-center justify-content grid gap-4 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute backdrop-filter backdrop-blur-sm w-full h-full z-10"></div>
              <LineChart data={getFakeData()} />
            </div>
            <div className="text-center">
              <ButtonHighlight onClick={createAccount}>
                Create a SendIt account
              </ButtonHighlight>
            </div>
          </div>
        </div>
      )
    } else if (account && !portfolioHistory.length) {
      content = (
        <div className="p-12 flex items-center justify-center h-full">
          <div className="p-4 full-h" onClick={(e) => getPortfolioValue(true)}>
            Not enough historical data available yet...
          </div>
        </div>
      )
    } else if (account) {
      const data = portfolioHistory.map((item) => {
        return {
          x: new Date(item.timestamp),
          y: parseFloat(item.value)
        }
      })

      content = (
        <div className="items-center justify-content grid gap-4">
          <div className="p-4" onClick={(e) => getPortfolioValue(true)}>
            <LineChart data={data} />
          </div>
        </div>
      )
    } else {
      content = (
        <div className="p-5">
          <div className="items-center justify-content grid gap-4 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute backdrop-filter backdrop-blur-sm w-full h-full z-10"></div>
              <LineChart data={getFakeData()} />
            </div>
            <div className="text-center">
              <ButtonHighlight onClick={() => connectWallet('SendIt')}>
                Login with the SendIt wallet to get access to your portfolio
                history
              </ButtonHighlight>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={classNames(
          styles.glowTableWrap,
          'bg-gray-700 overflow-hidden rounded-md text-gray-100'
        )}
      >
        <div className="bg-gray-700 overflow-hidden rounded-md text-gray-100 h-full">
          {content}
        </div>
      </div>
    )
  }
)
