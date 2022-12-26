import { Redirect } from 'react-router-dom';

const DefaultPage = () => {
  return <Redirect to='/v1/dashboard/home' />
}

export default DefaultPage;