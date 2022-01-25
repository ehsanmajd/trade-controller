import React from 'react';
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { useUserContext } from '../context/UserContext';

const AskForEmail: React.FC = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const { data: user } = useUserContext();
  React.useEffect(
    () => {
      if (user.askEmail) {
        const updateEmailPath = '/dashboard/update-email';
        if (location.pathname !== updateEmailPath) {
          history.replace(updateEmailPath);
        }
      }
    },
    [user.askEmail, history, location.pathname]
  )
  return <>{children}</>;
}

export default AskForEmail;