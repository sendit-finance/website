import { useEffect, useState } from 'react'
import { getTokenBySymbol } from '@sendit-finance/solana-garage/util'
import TokenIcon from '../util/TokenIcon'
import Reward from '../util/Reward'
import { Td } from '@/component/table/Td'
import getExplorerUrl from '@/util/get-explorer-url'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import StakeTransitionButton from './StakeTransitionButton'

const toUpperCase = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1)

const getSolStakeAccountStatus = (account) => {
  if (!account) {
    throw new TypeError('missing account argument')
  }

  return toUpperCase(account.stakeActivation.state)
}

const SolStakeAccountStatus = ({ account }) => {
  const status = getSolStakeAccountStatus(account)

  const color = status === 'Active' ? 'green-300' :
    status === 'Activating' ? 'green-200' :
    status === 'Deactivating' ? 'yellow-300' :
    'gray-400'

  return (
    <div className={`text-xs text-${color}`}>{status}</div>
  )
}

export default function RowStake({
  stake,
  onCloseAccount,
  onReopenAccount,
  onWithdrawAccount,
}) {
  const [coinToken, setCoinToken] = useState({})

  useEffect(async () => {
    const coinToken = await getTokenBySymbol(stake.name)
    setCoinToken(coinToken)
  }, [])

  return (
    <tr>
      <Td>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="-space-x-2 hidden sm:flex w-20 lg:w-auto">
              <TokenIcon name={coinToken.name} logoURI={coinToken.logoURI} />
            </div>
          </div>
          <div className="ml-0 sm:ml-4">
            <div className="text-sm font-medium">
              {stake.name.toUpperCase()}
              {stake.account?.data?.program === 'stake' && (
                <div className="text-xs">
                  <SolStakeAccountStatus account={stake.account} />
                </div>
              )}
              <div>
                <a className="underline text-xs text-green-100"
                  target="_blank"
                  href={getExplorerUrl(stake.publicKey)}>{stake.publicKey.toBase58().substr(0, 4)}&#8230;
                  <ExternalLinkIcon className="w-4 h-4 inline-block ml-1"/>
                </a>
              </div>
            </div>
            <div className="lg:hidden mt-2">
              Rewards:{' '}
              <Reward
                isRewardPending={stake.isRewardPending}
                reward={stake.reward}
                rewardValue={stake.rewardValue}
                coinToken={coinToken}
                tokenName={stake.tokenName}
                className="text-xs"
              />
            </div>
            <div className="lg:hidden mt-2">
              Staked:
              <div>{stake.depositBalance.format({ decimals: 4 })}</div>
            </div>
          </div>
        </div>
      </Td>
      <Td>
        {stake.apr.toFixed(2)}% <small>APR</small>
        <br />
        {stake.apy.toFixed(2)}% <small>APY</small>
      </Td>
      <Td className="hidden lg:table-cell">
        {stake.depositBalance.format({ decimals: 4 })}
      </Td>
      <Td className="hidden lg:table-cell">
        <Reward
          isRewardPending={stake.isRewardPending}
          reward={stake.reward}
          rewardValue={stake.rewardValue}
          coinToken={coinToken}
          tokenName={stake.tokenName}
        />
      </Td>
      <Td>${stake.totalValue.format({ decimals: 2 })}</Td>
      <Td>
        {stake.account?.data?.program === 'stake' && (
          <StakeTransitionButton
            stake={stake}
            status={getSolStakeAccountStatus(stake.account)}
            onCloseAccount={onCloseAccount}
            onReopenAccount={onReopenAccount}
            onWithdrawAccount={onWithdrawAccount}
          />
        )}
      </Td>
    </tr>
  )
}
