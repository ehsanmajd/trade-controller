import Layout from '../Layout'
import MainPage from '../components/pages/basket'
import Header from '../Header';


export default function Main() {
  
  return (
    <Layout ExtraHeader={Header}>
      <MainPage />
    </Layout>
  )
}
