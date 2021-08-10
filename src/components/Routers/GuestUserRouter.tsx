import {
  Switch,
  Route
} from "react-router-dom";
import DefaultPage from "../../pages/DefaultPage";
import SignIn from "../pages/signin";

interface Props {
  routePrefix: string;
}

export default function GuestUserRouter({ routePrefix }: Props) {
  return (
    <Switch>
      <Route path={`${routePrefix}/signin`}>
        <SignIn />
      </Route>
      <Route path={`${routePrefix}/`}>
        <DefaultPage />
      </Route>
    </Switch>
  )
}