export default function Reward({
  isRewardPending,
  rewardValue,
  reward,
  coinToken,
  tokenName,
  className = ''
}) {
  let label = 'Earned'
  if (isRewardPending) label = 'Pending'

  return (
    <div className={className}>
      ${rewardValue.format()} {label}
      <br />
      <small>
        ({reward.format()} {tokenName ?? coinToken.name})
      </small>
    </div>
  )
}
