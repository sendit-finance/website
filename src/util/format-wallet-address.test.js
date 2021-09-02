import formatWalletAddress from './format-wallet-address'

test('shortens address', () => {
  expect(formatWalletAddress('randomaddresswhichissuperlong')).toBe(
    'rand...long'
  )
})
