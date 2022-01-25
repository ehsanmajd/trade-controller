import React from 'react';

export interface UserContextDataModel {
  userId?: string;
  username?: string;
  name?: string;
  loggedIn: boolean;
  roles: string[];
  askEmail?: boolean;
}
export interface UserContextModel {
  data: UserContextDataModel;
  setData: (d: UserContextDataModel) => void;
}

export const UserContext = React.createContext<UserContextModel>({
  data: {
    username: '',
    name: '',
    loggedIn: false,
    roles: ['user'],
    askEmail: false
  },
  setData: () => undefined
});

export const useUserContext = () => React.useContext(UserContext);