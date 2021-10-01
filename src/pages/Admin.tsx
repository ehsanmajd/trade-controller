import Layout from '../components/Layout'
import AdminPanel from '../components/pages/admin'
import AdminAuth from '../components/AdminAuth'

export default function Main() {
  return (
    <Layout>
      <AdminAuth>
        <AdminPanel />
      </AdminAuth>
    </Layout>
  )
}
