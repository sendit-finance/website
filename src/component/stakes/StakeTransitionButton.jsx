import { useState } from 'react'
import { ButtonHighlight, ButtonDefault } from '@/component/form/Button'

export default function StakeTransitionButton ({
  onCloseAccount,
  onReopenAccount,
  onWithdrawAccount,
  stake,
  status
}) {
  const [inProgress, setProgress] = useState(false)

  const onComplete = () => {
    setProgress(false)
  }

  const deactivate = async (evt, stake) => {
    // remove stake from state
    setProgress(true)
    onCloseAccount(stake).catch((err) => {
      console.error('onCloseAccount error', err)
      onComplete()
    }).then(() => onComplete())
  }
  const restake = async (evt, stake) => {
    setProgress(true)
    onReopenAccount(stake).catch((err) => {
      console.error('onReopenAccount error', err)
      onComplete()
    }).then(() => onComplete())
  }
  const withdraw = async (evt, stake) => {
    setProgress(true)
    onWithdrawAccount(stake).catch((err) => {
      console.error('onWithdrawAccount error', err)
      onComplete()
    }).then(() => onComplete())
  }

  const actionMap = {
    'Active': { action: deactivate, text: 'Deactivate' },
    'Activating': { action: deactivate, text: 'Deactivate' },
    'Deactivating': { action: restake, text: 'Reopen' },
    'Inactive': { action: withdraw, text: 'Close' },
    'Initialized': { action: withdraw, text: 'Close' }
  }

  const { action, text } = actionMap[status] ?? {}

  if (!action) throw new Error(`Invalid stake status: ${status}`)

  const Button = inProgress ? ButtonDefault : ButtonHighlight

  return (
    <Button
      onClick={(evt) => action(evt, stake)}
      disabled={inProgress? 'disabled': ''}
      className="w-24"
    >
      {text}
    </Button>
  )
}