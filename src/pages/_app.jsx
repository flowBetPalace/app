import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/styles/globals.css'
import { useEffect } from 'react'
import Layout from '@/components/Layouts/Layout'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) 
}
