import { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";

const ServiceUnAvailable = () => {
  const user = useUserContext();
  const history = useHistory();
  useEffect(
    () => {
      if(user.data.loggedIn) {
        history.push('/v1/dashboard/home');
      }
    },
    [user.data.loggedIn, history]
  )
  return (
    <h1>Service Unavailable</h1>
  );
};

export default ServiceUnAvailable;
