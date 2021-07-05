import './App.css';
import Main from './pages/Main';
import Admin from './pages/Admin';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Main />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
