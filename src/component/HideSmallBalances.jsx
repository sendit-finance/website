import { connect } from 'redux-zero/react'
import Toggle from './form/Toggle'
import { combineActions } from 'redux-zero/utils'
import settingsActions from '@/actions/settings'
import tokenActions from '@/actions/tokens'

export default connect(
  ({ hideSmallBalances }) => ({ hideSmallBalances }),
  combineActions(settingsActions, tokenActions)
)(({ hideSmallBalances, updateSetting, refreshTokens }) => {
  function onChange(checked) {
    updateSetting('hideSmallBalances', checked)
    refreshTokens()
  }
  return (
    <label className="whitespace-nowrap  flex items-center">
      <Toggle
        onChange={onChange}
        checked={hideSmallBalances}
        className="mr-2"
      />{' '}
      Hide small balances
    </label>
  )
})
