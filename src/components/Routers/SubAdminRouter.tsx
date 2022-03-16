import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import SubAdmin from '../../pages/SubAdmin';

interface Props {
  routePrefix: string;
}

const SubAdminRouter: React.FC<Props> = ({ routePrefix }) => {
  return (
    <Switch>
      <Route path={`${routePrefix}/users`}>
        <SubAdmin />
      </Route>
    </Switch>
  )
}

export default SubAdminRouter;