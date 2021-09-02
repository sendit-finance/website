import Document, { Html, Head, Main, NextScript } from 'next/document'

class SendItDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <style jsx global>{`
            #__next {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
          `}</style>
          <script
            dangerouslySetInnerHTML={{
              __html: `
console.log(\`
    ____.                __
    |    |__ __  _______/  |_     ____   ____   ____   ____ _____
    |    |  |  \\\\/  ___/\\\\   __\\\\   / ___\\\\ /  _ \\\\ /    \\\\ /    \\\\\\\\__  \\\\
/\\\\__|    |  |  /\\\\___ \\\\  |  |    / \\\/_\\\/  >  <_> )   |  \\\\   |  \\\\/ __ \\\\_
\\\\________|____//____  > |__|    \\\\___  / \\\\____/|___|  /___|  (____  /
                    \\\\/         /_____/             \\\\/     \\\\/     \\\\/
                          .___ .__  __
  ______ ____   ____    __| _/ |__|/  |_
 /  ___// __ \\\\ /    \\\\  / __ |  |  \\\\   __\\\\
 \\\\___ \\\\\\\\  ___/|   |  \\\\/ \\/_/ |  |  ||  |
/____  >\\\\___  >___|  /\\\\____ |  |__||__|
     \\\\/     \\\\/     \\\\/      \\\\/
\`)
          `
            }}
          />
        </Head>
        <body className="bg-gray-900 text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default SendItDocument
