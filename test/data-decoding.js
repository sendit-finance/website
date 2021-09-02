import dotenv from 'dotenv'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import {
  publicKey,
  struct,
  u32,
  u64,
  u8,
  u128,
  bool
} from '@project-serum/borsh'
import { blob } from 'buffer-layout'
import Big from 'bignumber.js'
import { OpenOrders } from '@project-serum/serum'

import FARMS from '../src/const/farms'
import LIQUIDITY_POOLS from '../src/const/pools'

const ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

const STAKE_INFO_LAYOUT_V4 = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  u64('totalReward'),
  u128('perShare'),
  u64('perBlock'),
  u8('option'),
  publicKey('poolRewardTokenAccountB'),
  blob(7),
  u64('totalRewardB'),
  u128('perShareB'),
  u64('perBlockB'),
  u64('lastBlock'),
  publicKey('owner')
])

const USER_STAKE_INFO_ACCOUNT_LAYOUT_V4 = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt'),
  u64('rewardDebtB')
])

const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
])

const AMM_INFO_LAYOUT_V4 = struct([
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('systemDecimalsValue'),
  // Fees
  u64('minSeparateNumerator'),
  u64('minSeparateDenominator'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('pnlNumerator'),
  u64('pnlDenominator'),
  u64('swapFeeNumerator'),
  u64('swapFeeDenominator'),
  // OutPutData
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlPc'),
  u64('totalPnlCoin'),
  u128('poolTotalDepositPc'),
  u128('poolTotalDepositCoin'),
  u128('swapCoinInAmount'),
  u128('swapPcOutAmount'),
  u64('swapCoin2PcFee'),
  u128('swapPcInAmount'),
  u128('swapCoinOutAmount'),
  u64('swapPc2CoinFee'),

  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('poolWithdrawQueue'),
  publicKey('poolTempLpTokenAccount'),
  publicKey('ammOwner'),
  publicKey('pnlOwner')
])

const SERUM_PROGRAM_ID_V3 = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(
  new PublicKey(SERUM_PROGRAM_ID_V3)
)

const COMMITMENT = 'confirmed'

dotenv.config({ path: '.env.local' })

const PRICES = {
  USDC: 1,
  STEP: 1.5,
  COPE: 6.80025
}

//
// Generic stake program (v5)
//
const STAKE_PROGRAM_ID_V5 = '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z'

//
// getMultipleAccounts
//
async function getMultipleAccounts(connection, publicKeys, commitment) {
  const accounts = []
  const chunkedKeys = []
  const chunkSize = 10
  for (let i = 0, j = publicKeys.length; i < j; i += chunkSize) {
    chunkedKeys.push(
      publicKeys.slice(i, i + chunkSize).map((key) => key.toBase58())
    )
  }

  for (const keys of chunkedKeys) {
    const args = [keys, { commitment }]

    //
    // TODO: validate response
    //
    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)

    for (const account of unsafeRes.result.value) {
      if (!account) {
        accounts.push(null)
        continue
      }

      const { executable, owner, lamports, data } = account

      accounts.push({
        executable,
        owner: new PublicKey(owner),
        lamports,
        data: Buffer.from(data[0], 'base64')
      })
    }
  }

  return accounts.map((account, idx) => {
    if (account === null) {
      return null
    }
    return {
      publicKey: publicKeys[idx],
      account
    }
  })
}

function getFarmFromPoolId(poolId) {
  const farm = FARMS.find((farm) => farm.poolId === poolId)

  if (!farm) return

  return farm
}

function getPoolByName(poolName) {
  const pool = LIQUIDITY_POOLS.find((pool) => pool.name === poolName)

  if (!pool) return

  return pool
}

function getKeyByValue(object, value) {
  //
  // Recursively find the object key to a value.
  //
  let found
  function _find(obj, val) {
    return Object.keys(obj).some((key) => {
      if (typeof obj[key] === 'object') return _find(obj[key], val)
      if (obj[key] !== val) return
      found = key
      return true
    })
  }

  _find(object, value)

  return found
}

;(async () => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'))

  //
  // Get all program accounts for the stake program which are associated with the public key.
  // This returns all accounts associated with the V4 program, so we need to lookup which poolId the account
  // is part of (belongs to?).
  //
  let programAccounts = await connection.getProgramAccounts(
    new PublicKey(STAKE_PROGRAM_ID_V5),
    {
      commitment: COMMITMENT,
      filters: [
        {
          memcmp: {
            offset: 40,
            bytes: process.env.NEXT_PUBLIC_ACCOUNT_PUBLIC_KEY
          }
        },
        {
          dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.span
        }
      ],
      encoding: 'base64'
    }
  )

  const results = programAccounts.map(async ({ account }) => {
    const programAccount = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(
      account.data
    )

    //
    // For this example we'll skip all the non COPE-USDC accounts.
    //
    const poolId = programAccount.poolId.toBase58()
    const farmData = getFarmFromPoolId(poolId)

    if (!farmData) {
      console.error(`Pool ${poolId} not supported`)
      return
    }

    const poolData = getPoolByName(farmData.name)

    let pool = await connection.getAccountInfo(new PublicKey(poolId), {
      commitment: COMMITMENT
    })

    pool = STAKE_INFO_LAYOUT_V4.decode(pool.data)

    //
    // Get the staking pool info for the COPE-USDC account.
    //

    const fusionPool = new FusionPool(pool, programAccount, farmData)

    const poolLpTokenAccount = await connection.getAccountInfo(
      new PublicKey(farmData.poolLpTokenAccount),
      {
        commitment: COMMITMENT
      }
    )

    const { amount } = ACCOUNT_LAYOUT.decode(poolLpTokenAccount.data)
    fusionPool.setPoolLpTokenAmount(amount.toNumber())

    const accounts = await getMultipleAccounts(
      connection,
      [
        new PublicKey(poolData.lp.mintAddress),
        new PublicKey(poolData.poolCoinTokenAccount),
        new PublicKey(poolData.poolPcTokenAccount),
        new PublicKey(poolData.ammOpenOrders),
        new PublicKey(poolData.ammId)
      ],
      COMMITMENT
    )

    accounts.forEach(({ account, publicKey }) => {
      const accountType = getKeyByValue(poolData, publicKey.toBase58())

      switch (accountType) {
        case 'mintAddress':
          {
            const { supply } = MINT_LAYOUT.decode(account.data)
            fusionPool.setMintAccountSupply(supply.toNumber())
          }
          break
        case 'poolCoinTokenAccount':
          {
            const { amount } = ACCOUNT_LAYOUT.decode(account.data)
            fusionPool.addToCoinBalance(new Big(amount.toString()))
          }
          break
        case 'poolPcTokenAccount':
          {
            const { amount } = ACCOUNT_LAYOUT.decode(account.data)
            fusionPool.addToPcBalance(new Big(amount.toNumber()))
          }
          break
        case 'ammOpenOrders':
          {
            const {
              baseTokenTotal,
              quoteTokenTotal
            } = OPEN_ORDERS_LAYOUT.decode(account.data)

            fusionPool.addToPcBalance(new Big(quoteTokenTotal.toNumber()))
            fusionPool.addToCoinBalance(new Big(baseTokenTotal.toNumber()))
          }
          break
        case 'ammId':
          {
            const {
              needTakePnlCoin,
              needTakePnlPc
            } = AMM_INFO_LAYOUT_V4.decode(account.data)

            fusionPool.subtractFromCoinBalance(
              new Big(needTakePnlCoin.toNumber())
            )
            fusionPool.subtractFromPcBalance(new Big(needTakePnlPc.toNumber()))
          }
          break
      }
    })

    return fusionPool
  })

  const pools = await Promise.all(results)
  pools.forEach((pool) => {
    if (!pool) return
    const [coin, pc] = pool.poolData.name.split('-')
    console.log(pool && pool.toJSON(PRICES[coin], PRICES[pc]))
  })
})()

class FusionPool {
  constructor(pool, programAccount, poolData) {
    this.poolData = poolData
    this.pool = pool
    this.programAccount = programAccount

    this.pcBalance = new Big(0)
    this.pcPrice = new Big(0)

    this.coinBalance = new Big(0)
    this.coinPrice = new Big(0)
  }

  addToCoinBalance(amount) {
    this.coinBalance = this.coinBalance.plus(amount)
  }

  addToPcBalance(amount) {
    this.pcBalance = this.pcBalance.plus(amount)
  }

  subtractFromCoinBalance(amount) {
    this.coinBalance = this.coinBalance.minus(amount)
  }

  subtractFromPcBalance(amount) {
    this.pcBalance = this.pcBalance.minus(amount)
  }

  setMintAccountSupply(supply) {
    this.lpMintAccountSupply = new Big(supply)
  }

  setPoolLpTokenAmount(amount) {
    this.poolLpTokenAmount = new Big(amount)
  }

  getPendingRewardB() {
    return new Big(this.programAccount.depositBalance.toNumber())
      .multipliedBy(new Big(this.pool.perShareB.toString()))
      .dividedBy(1e15)
      .minus(this.programAccount.rewardDebtB.toNumber())
  }

  getAprB() {
    return this.getRewardPerBlockAmount(
      this.pool.perBlockB,
      this.coinPrice,
      this.poolData.rewardB.decimals
    )
      .div(this.getLiquidityUsdValue())
      .times(100)
  }

  getPendingRewardA() {
    return new Big(this.programAccount.depositBalance.toNumber())
      .multipliedBy(new Big(this.pool.perShare.toString()))
      .dividedBy(1e15)
      .minus(this.programAccount.rewardDebt.toNumber())
  }

  getAprA() {
    return this.getRewardPerBlockAmount(
      this.pool.perBlock,
      this.pcPrice,
      this.poolData.reward.decimals
    )
      .div(this.getLiquidityUsdValue())
      .times(100)
  }

  getRewardPerBlockAmount(perBlock, price, decimals) {
    return new Big(perBlock.toNumber())
      .dividedBy(new Big(10).exponentiatedBy(decimals))
      .times(2)
      .times(60)
      .times(60)
      .times(24)
      .times(365)
      .times(price)
  }

  getTotalApr() {
    const liquidityUsdValue = this.getLiquidityUsdValue()

    return this.getRewardPerBlockAmount(
      this.pool.perBlock,
      this.pcPrice,
      this.poolData.reward.decimals
    )
      .dividedBy(liquidityUsdValue)
      .times(100)
      .plus(
        this.getRewardPerBlockAmount(
          this.pool.perBlockB,
          this.coinPrice,
          this.poolData.rewardB.decimals
        )
          .dividedBy(liquidityUsdValue)
          .times(100)
      )
  }

  getLiquidityUsdValue() {
    const pcBalance = this.pcBalance.div(
      new Big(10).exponentiatedBy(this.poolData.lp.pc.decimals)
    )
    const coinBalance = this.coinBalance.div(
      new Big(10).exponentiatedBy(this.poolData.lp.coin.decimals)
    )

    const liquidityCoinValue = coinBalance.times(this.coinPrice)
    const liquidityPcValue = pcBalance.times(this.pcPrice)

    const liquidityTotalValue = liquidityPcValue.plus(liquidityCoinValue)
    const liquidityTotalSupply = new Big(this.lpMintAccountSupply.toNumber())
    const liquidityItemValue = liquidityTotalValue.div(liquidityTotalSupply)

    return this.poolLpTokenAmount.times(liquidityItemValue)
  }

  convertAprToApy(apr, timesPerYear = 365) {
    //
    // Compounding
    // https://web.archive.org/web/20210118110918/http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
    //
    return ((1 + apr / 100 / timesPerYear) ** timesPerYear - 1) * 100
  }

  getTotalValue() {
    //
    // Total value:
    // c = Total Supply / SQRT(COIN * COIN2)
    // value = 2 * LP * SQRT(Price COIN * Price COIN2 ) / c
    //
    const poolLpTokenAmount = this.poolLpTokenAmount.dividedBy(
      new Big(10).exponentiatedBy(this.poolData.lp.decimals)
    )
    const coinBalance = this.coinBalance.dividedBy(
      new Big(10).exponentiatedBy(this.poolData.lp.coin.decimals)
    )
    const pcBalance = this.pcBalance.dividedBy(
      new Big(10).exponentiatedBy(this.poolData.lp.pc.decimals)
    )
    const depositBalance = new Big(
      this.programAccount.depositBalance.toNumber()
    ).dividedBy(new Big(10).exponentiatedBy(this.poolData.lp.decimals))

    const c = poolLpTokenAmount.dividedBy(
      coinBalance.multipliedBy(pcBalance).squareRoot()
    )

    const value = new Big(2).times(
      new Big(depositBalance)
        .multipliedBy(this.coinPrice.multipliedBy(this.pcPrice).squareRoot())
        .dividedBy(c)
    )

    return value
  }

  toJSON(coinPrice = 0, pcPrice = 0) {
    this.coinPrice = new Big(coinPrice)
    this.pcPrice = new Big(pcPrice)

    const pendingRewardA = this.getPendingRewardA()
    const pendingRewardAValue = this.getPendingRewardA().times(pcPrice)

    const pendingRewardB = this.getPendingRewardB()
    const pendingRewardBValue = this.getPendingRewardB().times(coinPrice)

    return {
      name: this.poolData.name,
      lpTokenSupply: new TokenAmount(
        this.poolLpTokenAmount,
        this.poolData.lp.decimals
      ).format(),
      liquidityUsdValue: new TokenAmount(this.getLiquidityUsdValue()).format(),
      stakedLpTokens: new TokenAmount(
        this.programAccount.depositBalance,
        this.poolData.lp.decimals
      ).format(),

      totalValue: new TokenAmount(this.getTotalValue(), 2, false).format(),
      totalApr: this.getTotalApr().toFixed(2),

      pendingRewardA: new TokenAmount(
        pendingRewardA,
        this.poolData.lp.pc.decimals
      ).format(),
      pendingRewardAValue: new TokenAmount(
        pendingRewardAValue,
        this.poolData.lp.pc.decimals
      ).format(),

      aprA: this.getAprA().toFixed(2),
      apyA: this.convertAprToApy(this.getAprA()).toFixed(2),

      pendingRewardB: new TokenAmount(
        pendingRewardB,
        this.poolData.lp.coin.decimals
      ).format(),
      pendingRewardBValue: new TokenAmount(
        pendingRewardBValue,
        this.poolData.lp.coin.decimals
      ).format(),
      aprB: this.getAprB().toFixed(2),
      apyB: this.convertAprToApy(this.getAprB()).toFixed(2)
    }
  }
}

class TokenAmount {
  constructor(wei, decimals = 0, isWei = true) {
    this.decimals = decimals
    this._decimals = new Big(10).exponentiatedBy(decimals)

    if (isWei) {
      this.wei = new Big(wei)
    } else {
      this.wei = new Big(wei).multipliedBy(this._decimals)
    }
  }

  toEther() {
    return this.wei.dividedBy(this._decimals)
  }

  toWei() {
    return this.wei
  }

  format() {
    const vaule = this.wei.dividedBy(this._decimals)
    return vaule.toFormat(vaule.isInteger() ? 0 : this.decimals)
  }

  fixed() {
    return this.wei.dividedBy(this._decimals).toFixed(this.decimals)
  }

  isNullOrZero() {
    return this.wei.isNaN() || this.wei.isZero()
  }
}
