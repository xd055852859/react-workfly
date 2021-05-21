import React from 'react';
import Loadable from 'react-loadable';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Message from './components/common/message';

export default function Pages() {
  const App = Loadable({
    loader: () => import('./App'),
    loading: () => null,
  });
  const Welcome = Loadable({
    loader: () => import('./views/welcome/welcome'),
    loading: () => null,
  });
  const Help = Loadable({
    loader: () => import('./views/download/help'),
    loading: () => null,
  });
  const Test = Loadable({
    loader: () => import('./views/test/test'),
    loading: () => null,
  });
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/welcome" />} />
        <Route exact path="/welcome" component={Welcome} />
        <Route exact path="/help/:id" component={Help} />
        <Route exact path="/test" component={Test} />
        
        <Route path="/home" component={App} />
        {/* <Route path="/home" component={Home} /> */}
        {/* <Route path="/404" component={NotFound} />
        <Redirect to="/404" /> */}
      </Switch>
      <Message />
    </Router>
  );
}
