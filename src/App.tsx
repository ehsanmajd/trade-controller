import './App.css';
import Main from './pages/Main';
import Admin from './pages/Admin';
import SignIn from './pages/SignIn';
import Setting from './pages/Setting';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { UserContext, UserContextDataModel } from './context/UserContext';
import React from 'react';
import Auth from './components/Auth';
import SignOut from './pages/SignOut';
import Summary from './pages/Summary';
import DefaultPage from './pages/DefaultPage';
import BasketProvider from './components/BasketProvider';
import LoggedInUserRouter from './components/Routers/LoggedInUserRouter';
import GuestUserRouter from './components/Routers/GuestUserRouter';


function App() {
  const [user, setUser] = React.useState<UserContextDataModel>({
    loggedIn: false
  });

  return (
    <UserContext.Provider value={{ data: user, setData: setUser }}>
      <Router>
        <Switch>
          <Route path='/dashboard'>
            <LoggedInUserRouter routePrefix='/dashboard' />
          </Route>
          <Route path='/guest'>
            <GuestUserRouter routePrefix='/guest' />
          </Route>
          <Route path="/">
            <DefaultPage />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
