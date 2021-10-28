import React, { useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import * as service from '../service';
import { disposeAccessToken, disposeRefreshToken, getRefreshToken } from '../utils/token';

const SignOut: React.FC = () => {
  const { setData: setUser } = useUserContext();

  useEffect(
    () => {
      disposeAccessToken();
      service.signOut(
        getRefreshToken()
      ).then(
        () => {
          disposeRefreshToken();
          setUser({
            loggedIn: false,
            name: '',
            username: '',
            userId: null,
            roles: ['user']
          });
        }
      )
    },
    [setUser]
  );
  return null;
}

export default SignOut;