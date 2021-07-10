import React from 'react';
import { useUserContext } from '../UserContext';
import { Link } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const { data: user } = useUserContext();
  return (
    <div>
      <label>{`Welcome ${user.name || user.username || 'guest'}`}</label>
      {user.loggedIn && <Link to="/signout">sign out</Link>}
      {!user.loggedIn && <Link to="/signin">sign in</Link>}
    </div>
  )
}

export default UserInfo;