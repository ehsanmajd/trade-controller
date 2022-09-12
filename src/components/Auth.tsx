import React from 'react';
import {
  useHistory
} from "react-router-dom";
import { useUserContext } from '../context/UserContext';
import jwt_decode from "jwt-decode";
import { Token } from '../types/token';
import { getAccessToken } from '../utils/token';

const Auth: React.FC = ({ children }) => {
  const history = useHistory();
  const { data: user, setData: setUser } = useUserContext();
  React.useEffect(
    () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        const token = jwt_decode(accessToken) as Token;
        if (Date.now() < token.exp * 1000) {
          setUser({
            username: token.username,
            name: token.name,
            userId: token.userId,
            loggedIn: true,
            roles: token.roles,
            askEmail: token.askEmail,
            settings: token.settings
          });
          return;
        }
      }
      if (!user.loggedIn) {
        history.replace('/guest/signin')
      }
    },
    [user.loggedIn, setUser, history]
  )
  return <>{children}</>;
}

export default Auth;