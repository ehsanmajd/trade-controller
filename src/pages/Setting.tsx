import Layout from '../Layout'
import Servers from '../components/pages/server'
import Header from './Header';

export default function Setting() {
  return (
    <Layout ExtraHeader={Header}>
      <Servers />
    </Layout>
  )
}
