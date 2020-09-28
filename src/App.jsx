import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import FirstSurvey from './views/FirstSurvey';
import logo from './images/logo-mouth.png';
import { Navbar } from './components/Nav';
import { Dashboard } from './views/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  return (
    <Fragment>
      <Router>
        <Navbar logo={logo} />
        <div className="app-inner py-4 container-fluid">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute
              exact
              path="/surveys/first"
              component={FirstSurvey}
            />
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
};

export default App;
