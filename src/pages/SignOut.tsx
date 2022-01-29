import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import * as service from '../service';
import { disposeAccessToken, disposeRefreshToken, getRefreshToken } from '../utils/token';

const SignOut: React.FC = () => {
  const { setData: setUser } = useUserContext();
  const history = useHistory();

  useEffect(
    () => {
      service.signOut(
        getRefreshToken()
      ).then(
        () => {
          disposeAccessToken();
          disposeRefreshToken();
          setUser({
            loggedIn: false,
            name: '',
            username: '',
            userId: null,
            roles: ['user'],
            askEmail: false
          });
          history.replace('/guest/signin');
        }
      )
    },
    [setUser, history]
  );
  return null;
}

export default SignOut;