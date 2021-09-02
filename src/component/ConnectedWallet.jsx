import { ClipboardCopyIcon } from '@heroicons/react/solid'
import { connect } from 'redux-zero/react'
import copy from 'copy-to-clipboard'
import classNames from 'classnames'

import formatWalletAddress from '@/util/format-wallet-address'
import notificationAction from '@/actions/notification'

const mapToProps = ({ wallet, connected }) => ({ wallet, connected })

export default connect(
  mapToProps,
  notificationAction
)(({ wallet, connected, className, addNotification }) => {
  if (!connected) return null

  const publicKey = wallet.publicKey.toBase58()

  function copyToClipboard(text) {
    copy(text)
    addNotification({
      title: `Address copied to clipboard`,
      autoHide: true
    })
  }

  return (
    <div
      className={classNames(
        className,
        'inline-flex items-center text-sm cursor-pointer'
      )}
      onClick={(e) => {
        copyToClipboard(publicKey)
      }}
    >
      <span>{formatWalletAddress(publicKey)}</span>
      <ClipboardCopyIcon className="w-4 h-4 inline-block ml-1" />
    </div>
  )
})
