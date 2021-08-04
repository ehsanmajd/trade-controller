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
import { useBaskets } from './hooks/useBaskets';
import { BasketsContext } from './context/BasketsContext';
import Summary from './pages/Summary';
import DefaultPage from './pages/DefaultPage';


function App() {
  const [user, setUser] = React.useState<UserContextDataModel>({
    loggedIn: false
  });

  const { refresh, refreshTime, baskets } = useBaskets();

  return (
    <UserContext.Provider value={{ data: user, setData: setUser }}>
      <BasketsContext.Provider value={{ data: { refreshTime, baskets }, refresh }}>
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
              {user.loggedIn && <Route path="/summary">
                <Summary />
              </Route>}
              {user.loggedIn && <Route path="/">
                <DefaultPage />
              </Route>}
            </Switch>
          </Auth>
        </Router>
      </BasketsContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
