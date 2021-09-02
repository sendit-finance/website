import {
  Account,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'

import { ACCOUNT_LAYOUT } from './layouts'
import { TOKEN_PROGRAM_ID } from './ids'
// eslint-disable-next-line
import assert from 'assert'
import { initializeAccount } from '@project-serum/serum/lib/token-instructions'
import { define, union, array, literal, create } from 'superstruct'

// export const endpoint = 'https://api.mainnet-beta.solana.com'
export const endpoint = 'https://solana-api.projectserum.com'

export const commitment = 'confirmed'
// export const commitment = 'finalized'

export async function createAmmAuthority(programId) {
  const [ammAuthority, nonce] = await PublicKey.findProgramAddress(
    [new Uint8Array(Buffer.from('amm authority'.replace('\u00A0', ' '), 'utf-8'))],
    programId
  )

  return { ammAuthority, nonce }
}

export async function createTokenAccountIfNotExist(
  connection,
  account,
  owner,
  mintAddress,
  lamports,

  transaction,
  signer
) {
  let publicKey

  if (account) {
    publicKey = new PublicKey(account)
  } else {
    publicKey = await createProgramAccountIfNotExist(
      connection,
      account,
      owner,
      TOKEN_PROGRAM_ID,
      lamports,
      ACCOUNT_LAYOUT,
      transaction,
      signer
    )

    transaction.add(
      initializeAccount({
        account: publicKey,
        mint: new PublicKey(mintAddress),
        owner
      })
    )
  }

  return publicKey
}

export async function createProgramAccountIfNotExist(
  connection,
  account,
  owner,
  programId,
  lamports,
  layout,

  transaction,
  signer
) {
  let publicKey

  if (account) {
    publicKey = new PublicKey(account)
  } else {
    const newAccount = new Account()
    publicKey = newAccount.publicKey

    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: owner,
        newAccountPubkey: publicKey,
        lamports: lamports && (await connection.getMinimumBalanceForRentExemption(layout.span)),
        space: layout.span,
        programId
      })
    )

    signer.push(newAccount)
  }

  return publicKey
}

export async function getFilteredProgramAccounts(
  connection,
  programId,
  filters
) {
  // @ts-ignore
  const resp = await connection._rpcRequest('getProgramAccounts', [
    programId.toBase58(),
    {
      commitment: connection.commitment,
      filters,
      encoding: 'base64'
    }
  ])
  if (resp.error) {
    throw new Error(resp.error.message)
  }
  // @ts-ignore
  return resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
    publicKey: new PublicKey(pubkey),
    accountInfo: {
      data: Buffer.from(data[0], 'base64'),
      executable,
      owner: new PublicKey(owner),
      lamports
    }
  }))
}

// getMultipleAccounts
export async function getMultipleAccounts(
  connection,
  publicKeys,
  commitment
) {
  const keys = []
  let tempKeys = []

  publicKeys.forEach((k) => {
    if (tempKeys.length >= 100) {
      keys.push(tempKeys)
      tempKeys = []
    }
    tempKeys.push(k.toBase58())
  })
  if (tempKeys.length > 0) {
    keys.push(tempKeys)
  }

  const accounts = []

  for (const key of keys) {
    const args = [key, { commitment }]

    // @ts-ignore
    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)
    const res = create(unsafeRes, GetMultipleAccountsAndContextRpcResult)
    
    if (res.error) {
      throw new Error(
        'failed to get info about accounts ' + publicKeys.map((k) => k.toBase58()).join(', ') + ': ' + res.error.message
      )
    }

    assert(typeof res.result !== 'undefined')

    for (const account of res.result.value) {
      let value = null
      if (account === null) {
        accounts.push(null)
        continue
      }
      if (res.result.value) {
        const { executable, owner, lamports, data } = account
        assert(data[1] === 'base64')
        value = {
          executable,
          owner: new PublicKey(owner),
          lamports,
          data: Buffer.from(data[0], 'base64')
        }
      }
      if (value === null) {
        throw new Error('Invalid response')
      }
      accounts.push(value)
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

function jsonRpcResult(resultDescription) {
  const jsonRpcVersion = literal('2.0')
  return union([
    define({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'any'
    }),
    define({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'null?',
      result: resultDescription
    })
  ])
}

function jsonRpcResultAndContext(resultDescription) {
  return jsonRpcResult({
    context: define({
      slot: 'number'
    }),
    value: resultDescription
  })
}

const AccountInfoResult = define({
  executable: 'boolean',
  owner: 'string',
  lamports: 'number',
  data: 'any',
  rentEpoch: 'number?'
})

const GetMultipleAccountsAndContextRpcResult = jsonRpcResultAndContext(
  array([union(['null', AccountInfoResult])])
)

// transaction
export async function signTransaction(
  connection,
  wallet,
  transaction,
  signers = []
) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash(commitment)).blockhash
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey))
  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }
  return await wallet.signTransaction(transaction)
}

export async function sendTransaction(
  connection,
  wallet,
  transaction,
  signers = []
) {
  const signedTransaction = await signTransaction(connection, wallet, transaction, signers)
  return await sendSignedTransaction(connection, signedTransaction)
}

export async function sendSignedTransaction(connection, signedTransaction) {
  const rawTransaction = signedTransaction.serialize()

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment
  })

  return txid
}

export function mergeTransactions(transactions) {
  const transaction = new Transaction()
  transactions
    .filter((t) => t !== undefined)
    .forEach((t) => {
      transaction.add(t)
    })
  return transaction
}
