import '@/assets/styles/globals.css'
import { useEffect } from 'react'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }) {
  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) 
}
