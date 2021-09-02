import { Fragment } from 'react'
import { connect } from 'redux-zero/react'

import Notification from './Notification'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const mapToProps = ({ confirmWallet }) => ({ confirmWallet })

export default connect(mapToProps)(({ network, confirmWallet, ...props }) => {
  return (
    <Fragment>
      <Notification />
      <main
        className={classNames(
          'flex-auto flex flex-col items-stretch w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative stars',
          props.className
        )}
      >
        {props.children}
      </main>
      <div className="flyingsaucer" />
    </Fragment>
  )
})
