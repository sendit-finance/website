export default function formatWalletAddress(address) {
  return `${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`
}
