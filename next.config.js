const withTM = require('next-transpile-modules')([
  '@sendit-finance/solana-garage',
  '@project-serum/sol-wallet-adapter'
])

module.exports = withTM({
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SENDIT_API_URL:
      process.env.NEXT_PUBLIC_SENDIT_API_URL || 'https://api.sendit.finance',
    NEXT_PUBLIC_FEATURES: process.env.NEXT_PUBLIC_FEATURES || ''
  }
})
