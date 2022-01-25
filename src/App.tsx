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
            <Route path='/dashboard'>
              <LoggedInUserRouter routePrefix='/dashboard' />
            </Route>
            <Route path='/guest'>
              <GuestUserRouter routePrefix='/guest' />
            </Route>
            <Route path='/signout'>
              <SignOut />
            </Route>
            <Route path="/">
              <DefaultPage />
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
