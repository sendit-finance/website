import { connect } from 'redux-zero/react'
import networkAction from '@/actions/network'
import Disclaimer from '@/component/savings/disclaimer'
import WalletConnect from '@/component/WalletConnect.jsx'

const mapToProps = ({ network, connected }) => ({ network, connected })

export default connect(
  mapToProps,
  networkAction
)(() => {

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="">
          <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-10 lg:mt-6 lg:text-5xl xl:text-6xl text-center">
            <span className="text-green-300">SendIt Savings</span>
          </h1>
          <section className="justify-center text-center">
            <h2 className="mt-4 text-2xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-10 lg:mt-6 lg:text-3xl xl:text-4xl">
              <span>Tired of watching the markets go up and down?</span>
            </h2>
            <p className="px-32 mt-4">
              We get it. With a SendIt Savings Account, you can earn up to 6% APY*
              on your crypto so you can get back to enjoying life.
            </p>
            <p className="mt-4">Open a SendIt Savings Account today.</p>
            <div className="flex flex-1 items-center justify-center">
              <WalletConnect className="bg-green-300 rounded-md mt-4" loginText="Open Account" />
            </div>
          </section>
        </div>
      </div>
      <Disclaimer></Disclaimer>
    </>
  )
})