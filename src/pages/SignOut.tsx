import React, { useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import * as service from '../service';

const SignOut: React.FC = () => {
  const { setData: setUser } = useUserContext();

  useEffect(
    () => {
      window.localStorage.removeItem('at')
      service.signOut(
        window.localStorage.getItem('rt')
      ).then(
        () => {
          window.localStorage.removeItem('rt')
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