import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './components/HomePage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';

ReactDom.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={HomePage}/>
      <Route exact path="/signup" component={SignUpPage}/>
    </Switch>
  </BrowserRouter>, 
  document.getElementById('app')
);