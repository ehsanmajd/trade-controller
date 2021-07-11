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
import { UserContext, UserContextDataModel } from './UserContext';
import React from 'react';
import Auth from './components/Auth';
import SignOut from './pages/SignOut';


function App() {
  const [user, setUser] = React.useState<UserContextDataModel>({
    loggedIn: false
  });

  return (
    <UserContext.Provider value={{ data: user, setData: setUser }}>
      <Router>
        <Auth>
          <Switch>
            {user.loggedIn && <Route path="/home">
              <Main />
            </Route>}
            <Route path="/signin">
              <SignIn />
            </Route>
            {user.loggedIn && <Route path="/admin">
              <Admin />
            </Route>}
            {user.loggedIn && <Route path="/signout">
              <SignOut />
            </Route>}
            {user.loggedIn && <Route path="/setting">
              <Setting />
            </Route>}
            {user.loggedIn && <Route path="/">
              <Main />
            </Route>}
          </Switch>
        </Auth>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
