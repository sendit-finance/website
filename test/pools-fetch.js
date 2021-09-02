
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { nu64, struct, u8, blob } from 'buffer-layout'
import { publicKey, u128, u64 } from '@project-serum/borsh'
import { cloneDeep } from 'lodash'
import { TokenAmount } from './safe-math'
import { FARMS, getAddressForWhat } from './farms';
import { getMultipleAccounts, commitment } from './web3'
import { STAKE_INFO_LAYOUT_V4, STAKE_INFO_LAYOUT } from './stake';
import {ACCOUNT_LAYOUT} from './layouts'
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const WALLET_PUBLIC_KEY = '2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf';

const STAKE_PROGRAM_ID = 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q'
const STAKE_PROGRAM_ID_V4 = 'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T'
const STAKE_PROGRAM_ID_V5 = '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z'

const USER_STAKE_INFO_ACCOUNT_LAYOUT_V4 = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt'),
  u64('rewardDebtB')
])

function getFarmByPoolId(poolId) {
  const farm = FARMS.find((farm) => farm.poolId === poolId)

  if (farm) {
    return cloneDeep(farm)
  }

  return farm
}

const connection = new Connection(clusterApiUrl('mainnet-beta'));

const stakeFiltersV4 = [
  {
    memcmp: {
      offset: 40,
      bytes: new PublicKey(WALLET_PUBLIC_KEY).toBase58()
    }
  },
  {
    dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.span
  }
]

async function fetchPools(farmInfo) {
  const resp = await connection._rpcRequest('getProgramAccounts', [
    new PublicKey(STAKE_PROGRAM_ID_V5).toBase58(),
    {
      commitment: connection.commitment,
      filters: stakeFiltersV4,
      encoding: 'base64'
    }
  ]);

  const result = resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
    publicKey: new PublicKey(pubkey),
    accountInfo: {
      data: Buffer.from(data[0], data[1]),
      executable,
      owner: new PublicKey(owner),
      lamports
    }
  }))

  const stakeAccounts = {};
  result.forEach((stakeAccountInfo) => {
    const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
    const { data } = stakeAccountInfo.accountInfo

    const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(data)
    const poolId = userStakeInfo.poolId.toBase58()
    const depositBalance = userStakeInfo.depositBalance.toNumber()
    const rewardDebt = userStakeInfo.rewardDebt.toNumber()
    const rewardDebtB = userStakeInfo.rewardDebtB.toNumber()
    
    const farm = getFarmByPoolId(poolId)
    
    const { perShare, perBlock, perShareB, perBlockB } = farmInfo[poolId].poolInfo
    let d = 0
    if (farm.version === 5) {
      d = 1e15
    } else {
      d = 1e9
    }

    if (farm) {
      const depositBalanceTokenAmount = new TokenAmount(depositBalance, farm.lp.decimals);
      const rewardDebtTokenAmount = new TokenAmount(rewardDebt, farm.reward.decimals);
      const rewardDebtTokenAmountB = new TokenAmount(rewardDebtB, farm.rewardB.decimals);
      
      stakeAccounts[poolId] = {
        depositBalance: depositBalanceTokenAmount,
        rewardDebt: rewardDebtTokenAmount,
        rewardDebtB: rewardDebtTokenAmountB,
        stakeAccountAddress,
        
        pendingReward: new TokenAmount(depositBalanceTokenAmount.wei
          .multipliedBy(perShare.toNumber())
          .dividedBy(d)
          .minus(rewardDebtTokenAmount.wei), rewardDebt.decimals),
        
        pendingRewardB: new TokenAmount(depositBalanceTokenAmount.wei
          .multipliedBy(parseInt(perShareB.toString()))
          .dividedBy(d)
          .minus(rewardDebtTokenAmountB.wei), rewardDebtB.decimals)
      }
    }
  });
  console.log('Pending COPE', stakeAccounts['XnRBbNMf6YcWvC1u2vBXXuMcagmRBRLu1y84mpqnKwW'].pendingRewardB.format(), 'Deposit Balance', stakeAccounts['XnRBbNMf6YcWvC1u2vBXXuMcagmRBRLu1y84mpqnKwW'].depositBalance.format());
}

async function getFarms() {
  const farms = {}
  const publicKeys = []

  FARMS.forEach((farm) => {
    const { lp, poolId, poolLpTokenAccount } = farm

    publicKeys.push(new PublicKey(poolId), new PublicKey(poolLpTokenAccount))

    const farmInfo = cloneDeep(farm)

    farmInfo.lp.balance = new TokenAmount(0, lp.decimals)

    farms[poolId] = farmInfo
  });

  const multipleInfo = await getMultipleAccounts(connection, publicKeys, commitment)
  multipleInfo.forEach((info) => {
    if (info) {
      const address = info.publicKey.toBase58()
      const data = Buffer.from(info.account.data)

      const { key, poolId } = getAddressForWhat(address)

      if (key && poolId) {
        const farmInfo = farms[poolId]

        switch (key) {
          // pool info
          case 'poolId': {
            let parsed

            if ([4, 5].includes(farmInfo.version)) {
              parsed = STAKE_INFO_LAYOUT_V4.decode(data)
            } else {
              parsed = STAKE_INFO_LAYOUT.decode(data)
            }

            farmInfo.poolInfo = parsed

            break
          }
          // staked balance
          case 'poolLpTokenAccount': {
            const parsed = ACCOUNT_LAYOUT.decode(data)

            farmInfo.lp.balance.wei = farmInfo.lp.balance.wei.plus(parsed.amount.toNumber())

            break
          }
        }
      }
    }
  })
  return farms;
}

(async () => {
  const farmInfo = await getFarms();
  fetchPools(farmInfo);
})();