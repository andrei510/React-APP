import React, { FunctionComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from './dashboard'

const Pages: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Redirect to="/dashboard"></Redirect>
      </Switch>
    </React.Fragment>
  );
};

export default Pages;
