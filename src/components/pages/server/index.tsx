import ServerCards from './ServerCards';
import SharedBaskets from './SharedBaskets'
import BasketManagement from './BasketManagement'
import { useLocation } from 'react-router-dom';

export default function Index() {
  const location = useLocation();
  console.log(location);
  
  const showBasketManagement = location.pathname === '/dashboard/setting/new';
  return (
    <>
      <ServerCards />
      <hr />
      <hr />
      <SharedBaskets />
      {showBasketManagement && <>
        <hr />
        <hr />
        <BasketManagement />
      </>}
    </>
  );
}
