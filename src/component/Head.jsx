import Head from 'next/head'

export default function SendItHead({
  title = 'SendIt.Finance',
  description = 'SendIt! Fully send your Solana portfolio to the moon.',
  keywords = 'DEFI, Solana, portfolio, $SOL, sendit'
}) {
  return (
    <Head>
      <title>{title}</title>

      <meta charSet="utf-8" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1, initial-scale=1"
      />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="icon" type="image/svg+xml" href="/img/logo.svg" />

      <script
        async
        defer
        data-domain="sendit.finance"
        src="https://plausible.io/js/plausible.js"
      ></script>
    </Head>
  )
}
