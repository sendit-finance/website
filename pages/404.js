import { Fragment } from 'react'
import Link from 'next/link'

import Head from '../src/component/Head'
import Page from '../src/component/Page'
import Footer from '../src/component/Footer'

export default function SendIt404() {
  return (
    <Fragment>
      <Head />
      <Page className="stars">
        <div className="flex flex-1 flex-col justify-center max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-36 lg:px-8 relative">
          <div className="spin">
            <div className="satellite"></div>
          </div>
          <div className="flyingsaucer"></div>
          <div className="flex justify-center">
            <img
              src="/img/logo.svg"
              width="200"
              height="200"
              alt="SendIt Logo"
            />
          </div>
          <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-10 lg:mt-6 lg:text-5xl xl:text-6xl text-center">
            <span className="">Woups - 404</span>
          </h1>
          <div className="mt-12 flex justify-center">
            <span className="bg-green-300 py-2 px-4 rounded-sm text-black">
              <Link href="/">
                <a rel="noopener">Take me home</a>
              </Link>
            </span>
          </div>
        </div>
      </Page>
      <Footer />
    </Fragment>
  )
}
