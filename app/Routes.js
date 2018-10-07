/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import LabAlphaPage from './containers/LabAlphaPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.LAB_ALPHA} component={LabAlphaPage} />
      {/* first match wins, so routes.HOME must always be last */}
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
