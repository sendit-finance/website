import { useEffect, useState } from 'react'
import { getTokenBySymbol } from '@sendit-finance/solana-garage/util'
import TokenIcon from '@/component/util/TokenIcon'
import Reward from '@/component/util/Reward'
import { Td } from '@/component/table/Td'

export default function RowFusionPool({ pool }) {
  const [coin, pc] = pool.name.split('-')

  const [coinToken, setCoinToken] = useState({})
  const [pcToken, setPcToken] = useState({})

  useEffect(async () => {
    const coinToken = await getTokenBySymbol(coin)
    const pcToken = await getTokenBySymbol(pc)

    setCoinToken(coinToken)
    setPcToken(pcToken)
  }, [])

  return (
    <tr>
      <Td>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="-space-x-2 hidden md:flex w-20 lg:w-auto">
              <TokenIcon name={coinToken.name} logoURI={coinToken.logoURI} />
              <TokenIcon name={pcToken.name} logoURI={pcToken.logoURI} />
            </div>
          </div>
          <div className="ml-0 md:ml-4">
            <div className="text-sm font-medium">{pool.name}</div>
            <div className="mt-2 lg:hidden">
              Pending:
              <Reward
                isRewardPending={true}
                reward={pool.pendingRewardB}
                rewardValue={pool.pendingRewardBValue}
                coinToken={coinToken}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </Td>
      <Td className="hidden lg:table-cell">
        {pool.aprB.toFixed(2)}% <small>APR</small>
        <br />
        {pool.apyB.toFixed(2)}% <small>APY</small>
      </Td>
      <Td className="hidden lg:table-cell">{pool.stakedLpTokens.format()}</Td>
      <Td className="hidden lg:table-cell">
        <Reward
          isRewardPending={true}
          rewardValue={pool.pendingRewardBValue}
          reward={pool.pendingRewardB}
          coinToken={coinToken}
        />
      </Td>
      <Td>${pool.totalValue.format()}</Td>
    </tr>
  )
}
