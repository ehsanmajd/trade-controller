import React from 'react';
import {
  useHistory
} from "react-router-dom";
import { useUserContext } from '../context/UserContext';
import jwt_decode from "jwt-decode";

interface Token {
  exp: number;
  userId: string;
  name: string;
  username: string;
}

const Auth: React.FC = ({ children }) => {
  const history = useHistory();
  const { data: user, setData: setUser } = useUserContext();
  React.useEffect(
    () => {
      const accessToken = window.localStorage.getItem('at');
      if (accessToken) {
        const token = jwt_decode(accessToken) as Token;
        if (Date.now() < token.exp * 1000) {
          setUser({
            username: token.username,
            name: token.name,
            userId: token.userId,
            loggedIn: true
          });
          return;
        }
      }
      if (!user.loggedIn) {
        history.push('/signin')
      }
    },
    [user.loggedIn, setUser, history]
  )
  return <>{children}</>;
}

export default Auth;