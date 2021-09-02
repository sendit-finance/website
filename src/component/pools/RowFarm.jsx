import { useEffect, useState } from 'react'
import { getTokenBySymbol } from '@sendit-finance/solana-garage/util'
import TokenIcon from '@/component/util/TokenIcon'
import Reward from '@/component/util/Reward'
import { Td } from '@/component/table/Td'

export default function RowFarm({ pool }) {
  const [coin] = pool.name.split('-')

  const [coinToken, setCoinToken] = useState({})

  useEffect(async () => {
    const coinToken = await getTokenBySymbol(coin)
    setCoinToken(coinToken)
  }, [])

  return (
    <tr>
      <Td>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
              <TokenIcon name={coinToken.name} logoURI={coinToken.logoURI} />
            </div>
          </div>

          <div className="ml-0 md:ml-4">
            <div className="text-sm font-medium">{pool.name}</div>
            <div className="mt-2 lg:hidden">
              Pending:
              <Reward
                isPendingReward={true}
                reward={pool.pendingReward}
                rewardValue={pool.pendingRewardValue}
                coinToken={coinToken}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </Td>
      <Td className="hidden lg:table-cell">
        {pool.apr.toFixed(2)}% <small>APR</small>
        <br />
        {pool.apy.toFixed(2)}% <small>APY</small>
      </Td>
      <Td className="hidden lg:table-cell">{pool.stakedLpTokens.format()}</Td>
      <Td className="hidden lg:table-cell">
        <Reward
          isRewardPending={true}
          reward={pool.pendingReward}
          rewardValue={pool.pendingRewardValue}
          coinToken={coinToken}
        />
      </Td>
      <Td>${pool.totalValue.format()}</Td>
    </tr>
  )
}
