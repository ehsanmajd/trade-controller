import React from 'react';
import { Redirect } from 'react-router-dom';
import { Token } from '../types/token';
import { getAccessToken } from '../utils/token';
import jwt_decode from "jwt-decode";

const Admin: React.FC = ({ children }) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return <Redirect to='/signin' />
  }
  const token = jwt_decode(accessToken) as Token;
  
  if (token.roles.indexOf('admin') === -1) {
    // TODO: Uncomment carefully :)
    // return <Redirect to='/dashboard/access-denied' />
  }
  return <>{children}</>
}

export default Admin;