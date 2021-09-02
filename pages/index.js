import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'redux-zero/react'
import { combineActions } from 'redux-zero/utils'

import Page from '@/component/Page.jsx'
import Head from '@/component/Head'
import Nav from '@/component/Nav.jsx'
import networkActions from '@/actions/network'

const mapToProps = ({ connected }) => ({
  connected
})

export default connect(
  mapToProps,
  combineActions(networkActions)
)(({ createConnection }) => {
  const { query, push } = useRouter()

  useEffect(() => {
    createConnection()

    // XXX GOTCHA: In nextjs, on first render, query is empty.
    // We have to wait for the next render to access query and pass
    // it along in the redirect
    // https://github.com/vercel/next.js/issues/10521
    if (!/wallet=/.test(window.location.search)) {
      // no wallet in querystring, can redirect now
      push('/portfolio')
      return
    }

    if (!query.wallet) {
      // wait til next render
      return
    }

    const path = `/portfolio?wallet=${query.wallet}`
    push(path)
  })

  return (
    <>
      <Head title="SendIt.Finance - Portfolio" />
      <Nav />
      <Page></Page>
    </>
  )
})
