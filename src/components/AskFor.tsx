import React from 'react';
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { useUserContext } from '../context/UserContext';

interface Props {
  [name: string]: {
    userContextKey: string;
    pathname: string;
  } | any;
}

const AskFor: React.FC<Props> = ({ children, ...askForProps }) => {
  const history = useHistory();
  const location = useLocation();
  const { data: user } = useUserContext();

  const dependencies = Object.keys(askForProps).map(key => {
    const { userContextKey } = askForProps[key];
    return user[userContextKey];
  });

  React.useEffect(
    () => {
      const prop = Object.keys(askForProps).find(key => {
        const { userContextKey } = askForProps[key];
        return user[userContextKey];
      })
      if(prop && location.pathname !== askForProps[prop].pathname) {
        history.replace(askForProps[prop].pathname);
      }
    },
    [history, location.pathname, ...dependencies]
  )
  return <>{children}</>;
}

export default AskFor;