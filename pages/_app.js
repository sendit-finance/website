import 'tailwindcss/tailwind.css'
import '../src/css/style.css'

import { Provider } from 'redux-zero/react'
import store from '../src/store/app'

function SendIt({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default SendIt
