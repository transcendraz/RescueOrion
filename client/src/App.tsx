import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Room from './room';
import Admin from './admin';
import Join from './join';
import Landing from './Landing';

export default () => {

  return <BrowserRouter>
    <Switch>
      <Route
        path='/rooms'
        component={Room}
      >
      </Route>
      <Route
        path='/admin'
        component={Admin}
      />
      <Route
        path='/join'
        component={Join}
      />
      <Route
        path='/'
        component={Landing}
      />
    </Switch>
  </BrowserRouter>
}