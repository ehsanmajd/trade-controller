import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { UserContext, UserContextDataModel } from './context/UserContext';
import React from 'react';
import DefaultPage from './pages/DefaultPage';
import LoggedInUserRouter from './components/Routers/LoggedInUserRouter';
import GuestUserRouter from './components/Routers/GuestUserRouter';
import SignOut from './pages/SignOut';
import ServiceUnAvailable from './pages/ServiceUnAvailable';

const PREFIX = '/v1';

function App() {
  const [user, setUser] = React.useState<UserContextDataModel>({
    loggedIn: false,
    roles: []
  });

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <UserContext.Provider value={{ data: user, setData: setUser }}>
        <Router>
          <Switch>
            <Route path={`${PREFIX}/dashboard`}>
              <LoggedInUserRouter routePrefix={`${PREFIX}/dashboard`} />
            </Route>
            <Route path={`${PREFIX}/guest`}>
              <GuestUserRouter routePrefix={`${PREFIX}/guest`} />
            </Route>
            <Route path={`${PREFIX}/signout`}>
              <SignOut />
            </Route>
            <Route path={`${PREFIX}/`}>
              <DefaultPage />
            </Route>
            <Route path='/'>
              <ServiceUnAvailable />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
