import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { UserContext, UserContextDataModel } from './context/UserContext';
import React from 'react';
import DefaultPage from './pages/DefaultPage';
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
