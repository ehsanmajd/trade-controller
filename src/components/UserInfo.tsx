import React from 'react';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const { data: user } = useUserContext();
  console.log(user.roles);
  
  const isAdmin = user.roles.indexOf('admin') !== -1;
  return (
    <div>
      <label>{`Welcome ${user.name || user.username || 'guest'}`}</label>&nbsp;
      {user.loggedIn && <Link to="/dashboard/signout">sign out</Link>}
      &nbsp;
      {isAdmin && <Link to="/dashboard/admin">Admin panel</Link>}
      {!user.loggedIn && <Link to="/guest/signin">sign in</Link>}
    </div>
  )
}

export default UserInfo;