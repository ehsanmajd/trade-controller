import {
  Switch,
  Route
} from "react-router-dom";
import DefaultPage from "../../pages/DefaultPage";
import SignIn from "../pages/signin";
import Register from "../pages/register";

interface Props {
  routePrefix: string;
}

export default function GuestUserRouter({ routePrefix }: Props) {
  return (
    <Switch>
      <Route path={`${routePrefix}/signin`}>
        <SignIn />
      </Route>
      <Route path={`${routePrefix}/register`}>
        <Register />
      </Route>
      <Route path={`${routePrefix}/`}>
        <DefaultPage />
      </Route>
    </Switch>
  )
}