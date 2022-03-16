import Layout from '../components/Layout'
import { SudAdminUsers } from '../components/pages/subAdmin'
import AdminAuth from '../components/AdminAuth'

export default function Main() {
  return (
    <Layout>
      <AdminAuth>
        <SudAdminUsers />
      </AdminAuth>
    </Layout>
  )
}
