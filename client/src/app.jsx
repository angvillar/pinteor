import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './components/HomePage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';

ReactDom.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={HomePage}/>
      <Route exact path="/signup" component={SignUpPage}/>
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/dashboard" component={DashboardPage}/>
    </Switch>
  </BrowserRouter>, 
  document.getElementById('app')
);