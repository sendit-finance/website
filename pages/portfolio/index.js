import { useEffect } from 'react'

import { useRouter } from 'next/router'
import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'
import classNames from 'classnames'

import Page from '@/component/Page.jsx'
import networkActions from '@/actions/network'
import priceActions from '@/actions/price'
import walletActions from '@/actions/wallet'
import tokenActions from '@/actions/tokens'
import Tokens from '@/component/tokens/Tokens'
import Liquidity from '@/component/liquidity/Liquidity'
import WalletConnect from '@/component/WalletConnect.jsx'
import Nav from '@/component/Nav.jsx'
import PriceCard from '@/component/PriceCard'
import Head from '@/component/Head'
import Pools from '@/component/pools/Pools.jsx'
import Stakes from '@/component/stakes/Stakes'
import Savings from '@/component/savings/portfolio'
import PortfolioHistory from '@/component/PortfolioHistory'
import ribbonStyles from '@/component/Ribbon.module.css'
import Footer from '@/component/Footer'
import DemoPortfolio from '@/component/demo/Portfolio'
import DemoTokens from '@/component/demo/Tokens'
import DemoFarming from '@/component/demo/Farming'
import DemoStaking from '@/component/demo/Staking'

const mapToProps = ({ connected }) => ({
  connected
})

export default connect(
  mapToProps,
  combineActions(
    networkActions,
    priceActions,
    walletActions,
    tokenActions)
)(
  ({
    connected,
    createConnection,
    getPrices,
    getParsedTokenAccountsByOwner,
    connectWallet
  }) => {
    const { query, isReady } = useRouter()

    function load() {
      getParsedTokenAccountsByOwner().then(() => getPrices())
    }

    useEffect(() => {
      createConnection()
    }, [])

    useEffect(() => {
      if (!connected) return
      load()
      const id = setInterval(load, 29000)
      return () => {
        // TODO prevent unnecessarily continuing to load the portfolio view
        // emitter.isStopped = true
        clearInterval(id)
      }
    })

    //
    // This allows the user to use a public key using the following format:
    // https://sendit.finance/portfolio/?wallet=KEY
    //
    // Next.js router doesn't initialize the query property at first render
    // if the page is not hydrating the query paramter. Because of this,
    // we need to check if the query parameters are set and only then
    // initialize the wallet.
    //
    useEffect(() => {
      if (!query.wallet) return

      connectWallet('ReadOnly', {
        publicKey: query.wallet
      })
    }, [query.wallet])

    return (
      <>
        <Head title="SendIt.Finance - Portfolio" />
        <Nav />
        <Page>
          {!connected ? (
            <div className="flex-1 flex items-center justify-center">
              <div>
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:leading-10 mt-28 lg:text-5xl xl:text-6xl text-center">
                  <span className="text-green-300">SendIt Portfolio</span>
                </h1>
                <section className="justify-center text-center">
                  <h2 className="mt-4 sm:text-2xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-10 lg:mt-6 lg:text-3xl xl:text-4xl">
                    Your entire Solana portfolio at a glance
                  </h2>
                  <div className="flex flex-1 items-center justify-center">
                    <div>
                      <div className="mt-8 bg-green-300 rounded-md flex-1 flex items-center justify-center">
                        <WalletConnect />
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <div className="mt-24">
                    <div className="relative bg-gray-700 overflow-hidden rounded-md text-gray-100 p-6">
                      <div
                        className={classNames(
                          ribbonStyles.ribbon,
                          'ribbon bg-green-400 text-sm text-gray-900 whitespace-no-wrap px-4'
                        )}
                      >
                        Demo
                      </div>
                      <DemoPortfolio />
                      <DemoTokens />
                      <DemoFarming />
                      <DemoStaking />
                    </div>
                  </div>
                </section>
                <section className="justify-center text-center">
                  <p className="px-16 mt-12">
                    Login now to start managing your portfolio today.
                  </p>
                  <div className="flex flex-1 items-center justify-center">
                    <div>
                      <div className="mt-8 bg-green-300 rounded-md flex-1 flex items-center justify-center">
                        <WalletConnect />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-8 mb-8 grid gap-8">
              <div className="grid gap-8 md:grid-cols-2">
                <PriceCard label="Net worth" />
                <PortfolioHistory />
              </div>
              <Tokens />
              <Savings />
              <Pools />
              <Stakes />
              <Liquidity />
            </div>
          )}
        </Page>
        <Footer />
      </>
    )
  }
)
