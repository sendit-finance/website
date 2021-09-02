export default function getExplorerUrl(publicKey) {
  const key = publicKey.toBase58 ? publicKey.toBase58() : String(publicKey)
  return `https://explorer.solana.com/address/${key}`
}