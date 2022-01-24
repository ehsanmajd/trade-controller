import Main from "../../pages/Main";
import Setting from "../../pages/Setting";
import BasketProvider from "../BasketProvider";
import Summary from "../../pages/Summary";
import {
  Switch,
  Route
} from "react-router-dom";
import Admin from "../../pages/Admin";
import Auth from "../Auth";
import SignOut from "../../pages/SignOut";
import AccessDenied from '../../pages/AccessDenied';
import Logs from '../../pages/Logs';
import Charts from "../../pages/Charts";
import ChangePassword from "../../pages/ChangePassword";

interface Props {
  routePrefix: string;
}

export default function LoggedInUserRouter({ routePrefix }: Props) {
  return (
    <Auth>
      <BasketProvider>
        <Switch>
          <Route path={`${routePrefix}/home`}>
            <Main />
          </Route>
          <Route path={`${routePrefix}/change-password`}>
            <ChangePassword />
          </Route>
          <Route path={`${routePrefix}/setting`}>
            <Setting />
          </Route>
          <Route path={`${routePrefix}/summary`}>
            <Summary />
          </Route>
          <Route path={`${routePrefix}/logs`}>
            <Logs />
          </Route>
          <Route path={`${routePrefix}/charts`}>
            <Charts />
          </Route>
          <Route path={`${routePrefix}/admin`}>
            <Admin />
          </Route>
          <Route path={`${routePrefix}/signout`}>
            <SignOut />
          </Route>
          <Route path={`${routePrefix}/access-denied`}>
            <AccessDenied />
          </Route>
        </Switch>
      </BasketProvider>
    </Auth>
  )
}